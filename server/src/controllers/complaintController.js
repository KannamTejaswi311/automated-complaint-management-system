import Complaint from "../models/Complaint.js";

export const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({
      urgency: -1,
      createdAt: -1,
    });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch complaints" });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!complaint) {
      return res.status(404).json({ error: "Complaint not found" });
    }

    res.json(complaint);
  } catch (err) {
    res.status(500).json({ error: "Status update failed" });
  }
};
