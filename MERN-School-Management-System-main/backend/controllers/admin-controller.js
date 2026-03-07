const Admin = require('../models/adminSchema.js');

// Admin registration is disabled - only predefined admin can login
const adminRegister = async (req, res) => {
    return res.status(403).send({ 
        message: 'Admin registration is disabled. Please contact system administrator.' 
    });
};

// Admin login - only accepts credentials from environment variables
const adminLogIn = async (req, res) => {
    try {
        if (!req.body.email || !req.body.password) {
            return res.send({ message: "Email and password are required" });
        }

        // Check against environment variables
        const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
        const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

        if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
            return res.status(500).send({ 
                message: "Admin credentials not configured. Please contact system administrator." 
            });
        }

        // Validate credentials
        if (req.body.email === ADMIN_EMAIL && req.body.password === ADMIN_PASSWORD) {
            // Check if admin exists in database, if not create one
            let admin = await Admin.findOne({ email: ADMIN_EMAIL });
            
            if (!admin) {
                // Create admin record in database
                admin = new Admin({
                    name: "System Administrator",
                    email: ADMIN_EMAIL,
                    password: ADMIN_PASSWORD,
                    collegeName: "Main College",
                    role: "Admin"
                });
                await admin.save();
            }

            // Return admin data without password
            admin.password = undefined;
            res.send(admin);
        } else {
            res.send({ message: "Invalid email or password" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const getAdminDetail = async (req, res) => {
    try {
        let admin = await Admin.findById(req.params.id);
        if (admin) {
            admin.password = undefined;
            res.send(admin);
        }
        else {
            res.send({ message: "No admin found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
}

const checkAdminExists = async (req, res) => {
    try {
        // Always return false to disable registration UI
        res.send({ exists: true });
    } catch (err) {
        res.status(500).json(err);
    }
}

// const deleteAdmin = async (req, res) => {
//     try {
//         const result = await Admin.findByIdAndDelete(req.params.id)

//         await Sclass.deleteMany({ school: req.params.id });
//         await Student.deleteMany({ school: req.params.id });
//         await Teacher.deleteMany({ school: req.params.id });
//         await Subject.deleteMany({ school: req.params.id });
//         await Notice.deleteMany({ school: req.params.id });
//         await Complain.deleteMany({ school: req.params.id });

//         res.send(result)
//     } catch (error) {
//         res.status(500).json(err);
//     }
// }

// const updateAdmin = async (req, res) => {
//     try {
//         if (req.body.password) {
//             const salt = await bcrypt.genSalt(10)
//             res.body.password = await bcrypt.hash(res.body.password, salt)
//         }
//         let result = await Admin.findByIdAndUpdate(req.params.id,
//             { $set: req.body },
//             { new: true })

//         result.password = undefined;
//         res.send(result)
//     } catch (error) {
//         res.status(500).json(err);
//     }
// }

// module.exports = { adminRegister, adminLogIn, getAdminDetail, deleteAdmin, updateAdmin };

module.exports = { adminRegister, adminLogIn, getAdminDetail, checkAdminExists };
