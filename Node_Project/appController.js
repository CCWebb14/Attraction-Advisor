const express = require('express');
const appService = require('./appService');

const router = express.Router();

// ----------------------------------------------------------
// API endpoints
// Modify or extend these routes based on your project's needs.
router.get('/check-db-connection', async (req, res) => {
    const isConnect = await appService.testOracleConnection();
    if (isConnect) {
        res.send('connected');
    } else {
        res.send('unable to connect');
    }
});

router.post('/get-attractions', async (req, res) => {
    const { province, city } = req.body;
    console.log(province, city)
    const tableContent = await appService.getAttractions(province, city);
    res.json({ data: tableContent });
});

router.post('/add-attraction', async (req, res) => {
    const { name, description, open, close, lat, long, category, province, city } = req.body;
    const tableContent = await appService.addAttraction(name, description, open, close, lat, long, category, province, city);
    res.json({ data: tableContent });
})

router.delete('/delete-attraction', async (req, res) => {
    const { attractionID } = req.body;
    const success = await appService.deleteAttraction(attractionID);
    if (success) {
        res.status(200).json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
})


router.get('/demotable', async (req, res) => {
    const tableContent = await appService.fetchDemotableFromDb();
    res.json({ data: tableContent });
});

router.post("/insert-demotable", async (req, res) => {
    const { id, name } = req.body;
    const insertResult = await appService.insertDemotable(id, name);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/update-name-demotable", async (req, res) => {
    const { oldName, newName } = req.body;
    const updateResult = await appService.updateNameDemotable(oldName, newName);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.get('/count-demotable', async (req, res) => {
    const tableCount = await appService.countDemotable();
    if (tableCount >= 0) {
        res.json({
            success: true,
            count: tableCount
        });
    } else {
        res.status(500).json({
            success: false,
            count: tableCount
        });
    }
});

router.post("/project-tables", async (req, res) => {
    const { attractionID, selectedBoxes } = req.body;
    console.log(attractionID, selectedBoxes); // testing
    try {
        const projectedExperiences = await appService.projectExperienceAttributes(attractionID, selectedBoxes);

        if (projectedExperiences) {
            res.json({ projectedExperiences });
        } else {
            res.status(400).json({ success: false });
        }
    } catch (error) {
        res.status(400).json({ success: false });
    }
});


router.post("/filter-experiences", async (req, res) => {
    const {price, comparison} = req.body;
    console.log(price, comparison); //testing
    try {
        const filteredExperiences = await appService.applyPriceFilters(price, comparison);

        if (filteredExperiences) {
            res.json({filteredExperiences});
        } else {
            res.status(400).json({ success: false });
        }
    } catch (error){
        res.status(400).json({ success: false });
    }
})

router.post("/find-completionists", async (req, res) => {
    const { attractionID } = req.body;
    const tableContent = await appService.findCompletionist(attractionID);
    if (tableContent[0]) {
        res.status(200).json({ success: true, data: tableContent });
    } else {
        res.status(400).json({ success: false });
    }
});



module.exports = router;