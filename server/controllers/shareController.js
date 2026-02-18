import crypto from 'crypto';
import ShareLink from '../models/ShareLink.js';
import CalendarEntry from '../models/CalendarEntry.js';

// Generate a new Share Link (Requires Auth)
export const createShareLink = async (req, res) => {
  try {
    // type: 'snapshot' | 'live'
    // permission: 'view' | 'edit'
    const { type, permission } = req.body; 
    
    // Generate a secure 48-character random token
    const token = crypto.randomBytes(24).toString('hex');

    const newLink = await ShareLink.create({
      token,
      owner: req.user,
      type,
      // Snapshots are static, so they must be view-only
      permission: type === 'snapshot' ? 'view' : permission 
    });

    // Send back the constructed URL for the frontend
    const shareUrl = `${process.env.CLIENT_URL}/shared/${token}`;
    res.status(201).json({ shareUrl, linkData: newLink });
  } catch (error) {
    res.status(500).json({ message: 'Error creating share link', error: error.message });
  }
};

// Fetch calendar data via a Share Token (Public Route)
export const getSharedCalendar = async (req, res) => {
  try {
    const { token } = req.params;
    
    // Find the link and ensure it hasn't been deactivated
    const link = await ShareLink.findOne({ token, active: true });
    if (!link) {
      return res.status(404).json({ message: 'Invalid or expired share link' });
    }

    // Fetch the owner's calendar entries using .lean() to get raw JSON objects
    const entries = await CalendarEntry.find({ owner: link.owner })
      .populate('blueprintId', 'title color')
      .lean(); 

    // TYPE A: SNAPSHOT LOGIC
    if (link.type === 'snapshot') {
      // Strip away database IDs and owner data so it is a purely detached copy.
      // If User B edits this on their end, it won't affect User A's database.
      const snapshotEntries = entries.map(entry => {
        const { _id, owner, blueprintId, ...rest } = entry;
        return { 
          ...rest, 
          title: blueprintId?.title, 
          color: blueprintId?.color,
          isSnapshot: true 
        };
      });
      
      return res.status(200).json({ 
        type: 'snapshot', 
        permission: 'view', 
        entries: snapshotEntries 
      });
    }

    // TYPE B: LIVE LOGIC
    // We send the actual DB records. If permission is 'edit', the frontend
    // will be allowed to send updates via WebSockets back to these IDs.
    res.status(200).json({ 
      type: 'live', 
      permission: link.permission, 
      entries 
    });

  } catch (error) {
    res.status(500).json({ message: 'Error fetching shared calendar', error: error.message });
  }
};