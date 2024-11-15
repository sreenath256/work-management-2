import PunchInRecord from "../models/punchInRecord.js";
import PunchOutRecord from "../models/punchOutRecord.js";



const punchInControllers = () => {

    const punchInUser = async (req, res) => {

        
        try {
            const userId = req.payload.id
            const { latitude, longitude } = req.body;

            console.log(latitude, longitude);
            
            const companyLocation = { latitude: process.env.COMPANY_LOCATION_LATITUDE, longitude: process.env.COMPANY_LOCATION_LONGITUDE };

            const today = new Date().toISOString().slice(0, 10); // Get the current date in YYYY-MM-DD format

            // Find the latest punch-in record for the user today
            const latestPunchInRecord = await PunchInRecord.findOne({
                userId,
                punchInTime: { $gte: new Date(today + 'T00:00:00.000Z'), $lte: new Date(today + 'T23:59:59.999Z') },
            }).sort({ punchInTime: -1 });


            // If there is already punch-in record, the user cant't punch in
            if (latestPunchInRecord) {
                
                return res.status(400).json({ error: 'You are already punched in.' });
            }


            const calculateDistance = (lat1, lon1, lat2, lon2) => {
                const R = 6371e3; // Earth's radius in meters
                const φ1 = (lat1 * Math.PI) / 180;
                const φ2 = (lat2 * Math.PI) / 180;
                const Δφ = ((lat2 - lat1) * Math.PI) / 180;
                const Δλ = ((lon2 - lon1) * Math.PI) / 180;

                const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                    Math.cos(φ1) * Math.cos(φ2) *
                    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

                return R * c; // Distance in meters
            };

            // Calculate the distance between the user's location and the company location
            const distance = calculateDistance(
                latitude,
                longitude,
                companyLocation.latitude,
                companyLocation.longitude
            );

            // Check if the user is within the 30-meter radius
            if (distance <= 30) {
                // Create a new punch-in record with successful status
                const punchInRecord = await PunchInRecord.create({
                    userId,
                    punchInTime: new Date(),
                    punchInLocation: `${latitude}, ${longitude}`,
                    distance,
                });
                res.status(201).json(punchInRecord);
            } else {
                res.status(400).json({ error: 'You are not in the company.', distance: distance });
            }
        } catch (error) {
            console.log(error);

            return res.status(500).json({ status: false, message: "Internal error", log: error })
        }

    }

    const checkTodayPunchInStatus = async (req, res) => {
        try {
            const userId = req.payload.id;
            const today = new Date().toISOString().slice(0, 10); // Get current date in YYYY-MM-DD format
    
            // Find today's punch-in record for the user
            const todayPunchRecord = await PunchInRecord.findOne({
                userId,
                punchInTime: {
                    $gte: new Date(today + 'T00:00:00.000Z'),
                    $lte: new Date(today + 'T23:59:59.999Z')
                }
            });
    
            if (!todayPunchRecord) {
                return res.status(200).json({
                    status: true,
                    isPunchedIn: false,
                    message: "No punch-in record found for today"
                });
            }
    
            // If record exists, format and return the data
            return res.status(200).json({
                status: true,
                isPunchedIn: true,
                message: "User has punched in today",
                punchInDetails: {
                    punchInTime: todayPunchRecord.punchInTime,
                    punchInLocation: todayPunchRecord.punchInLocation,
                    distance: todayPunchRecord.distance,
                    timeElapsed: Math.round((new Date() - new Date(todayPunchRecord.punchInTime)) / (1000 * 60)) // minutes elapsed since punch-in
                }
            });
    
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                status: false,
                message: "Internal server error",
                error: error.message
            });
        }
    };


    const punchOutUser = async (req, res) => {
        try {
            const userId = req.payload.id;

            const today = new Date().toISOString().slice(0, 10); // Get the current date in YYYY-MM-DD format

            // Find the latest punch-in record for the user today
            const latestPunchInRecord = await PunchInRecord.findOne({
                userId,
                punchInTime: { $gte: new Date(today + 'T00:00:00.000Z'), $lte: new Date(today + 'T23:59:59.999Z') },
            }).sort({ punchInTime: -1 });


            // If there's no open punch-in record, the user hasn't punched in yet
            if (!latestPunchInRecord) {
                return res.status(400).json({ error: 'You have not punched in yet.' });
            }


            // Find the latest punch-out record for the user today
            const latestPunchOutRecord = await PunchOutRecord.findOne({
                userId,
                punchOutTime: null,
                punchInTime: { $gte: new Date(today + 'T00:00:00.000Z'), $lte: new Date(today + 'T23:59:59.999Z') },
            }).sort({ punchInTime: -1 });


            // If there is already punched-ou record, the user cant't punch out
            if (latestPunchOutRecord) {
                return res.status(400).json({ error: 'You are already punched out.' });
            }

            // Calculate the distance between the user's current location and the company location
            const { latitude, longitude } = req.body;
            const companyLocation = { latitude: process.env.COMPANY_LOCATION_LATITUDE, longitude: process.env.COMPANY_LOCATION_LONGITUDE };


            const calculateDistance = (lat1, lon1, lat2, lon2) => {
                const R = 6371e3; // Earth's radius in meters
                const φ1 = (lat1 * Math.PI) / 180;
                const φ2 = (lat2 * Math.PI) / 180;
                const Δφ = ((lat2 - lat1) * Math.PI) / 180;
                const Δλ = ((lon2 - lon1) * Math.PI) / 180;

                const a =
                    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

                return R * c; // Distance in meters
            };

            const distance = calculateDistance(
                latitude,
                longitude,
                companyLocation.latitude,
                companyLocation.longitude
            );

            // Check if the user is within the 30-meter radius
            if (distance <= 30) {
                // Create a new punch-in record with successful status
                const punchOutRecord = await PunchOutRecord.create({
                    userId,
                    punchOutTime: new Date(),
                    punchOutLocation: `${latitude}, ${longitude}`,
                    distance,
                });
                res.status(201).json(punchOutRecord);
            } else {
                res.status(400).json({ error: 'You are not in the company.', distance: distance });
            }
        } catch (error) {
            console.log(error);

            return res
                .status(500)
                .json({ status: false, message: 'Internal error', log: error });
        }
    };

    const checkTodayPunchOutStatus = async (req, res) => {
        try {
            const userId = req.payload.id;
            const today = new Date().toISOString().slice(0, 10); // Get current date in YYYY-MM-DD format
    
            // Find today's punch-in record for the user
            const todayPunchRecord = await PunchOutRecord.findOne({
                userId,
                punchOutTime: {
                    $gte: new Date(today + 'T00:00:00.000Z'),
                    $lte: new Date(today + 'T23:59:59.999Z')
                }
            });
    
            if (!todayPunchRecord) {
                return res.status(200).json({
                    status: true,
                    isPunchedIn: false,
                    message: "No punch-out record found for today"
                });
            }
    
            // If record exists, format and return the data
            return res.status(200).json({
                status: true,
                isPunchedOut: true,
                message: "User has punched out today",
                punchOutDetails: {
                    punchOutTime: todayPunchRecord.punchOutTime,
                    punchOutLocation: todayPunchRecord.punchOutLocation,
                    distance: todayPunchRecord.distance,
                    timeElapsed: Math.round((new Date() - new Date(todayPunchRecord.punchOutTime)) / (1000 * 60)) // minutes elapsed since punch-in
                }
            });
    
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                status: false,
                message: "Internal server error",
                error: error.message
            });
        }
    };




    return {
        punchInUser,
        punchOutUser,
        checkTodayPunchInStatus,
        checkTodayPunchOutStatus

    }
}

export default punchInControllers;