const express = require('express');
const router = express.Router();
const {
    createOurTeam,
  getOurTeam,
  getTeamByID,
  updateTeamStatus,
  deleteOurTeam,
  updateTeam
} = require('../controllers/team');

// Route to add information and image upload
router.post('/upload', createOurTeam);

// Route to get all Team
router.get('/get', getOurTeam);

// Route to get Team by ID
router.get('/getByID/:id', getTeamByID);

// Route to update Team status
router.patch('/updateStatus', updateTeamStatus);


// Route to delete Team
router.delete('/delete/:id', deleteOurTeam);

// Route to update Team entry
router.put('/update/:id', updateTeam);

module.exports = router;
