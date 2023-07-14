const express = require('express');
const userModel = require('../models/userModel');
const contactModel = require('../models/contactModel');
const counterModel = require('../models/counterModel');

const fs = require('fs');
const path = require('path');

const router = express.Router()


// router.post('/adduser', (req, res) => {
//     counterModel.findOneAndUpdate({ id: "autoval" }, { "$inc": { "newId": 1 } }, { new: true })
//         .then((cd) => {
//             // if (!cd) {
//             //     const newval = new counterModel({ id: "autoval", newId: 1 });
//             //     newval.save();
//             //     cd = { newId: 1 };
//             // }

//             const data = new contactModel({
//                 userId: cd.newId,
//                 avatar: req.body.avatar,
//                 online: req.body.online,
//                 firstName: req.body.firstName,
//                 lastName: req.body.lastName,
//                 jobPos: req.body.jobPos,
//                 primPhone: req.body.primPhone,
//                 secPhone: req.body.secPhone,
//                 primEmail: req.body.primEmail,
//                 secEmail: req.body.secEmail,
//                 bio: req.body.bio,
//                 bday: req.body.bday,
//                 twitter: req.body.twitter,
//                 facebook: req.body.facebook,
//                 linkedin: req.body.linkedin,
//                 pinterest: req.body.pinterest,
//                 google: req.body.google,
//                 meeting: req.body.meeting,
//             });

//             return data.save();
//         })
//         .then((dataToSave) => {
//             res.status(200).json(dataToSave);
//         })
//         .catch((error) => {
//             res.status(400).json({ message: error.message });
//         });
// });

// router.get('/contacts', async (req, res) => {
//     try {
//         const data = await contactModel.find({}, 'userId avatar online firstName lastName jobPos primPhone').sort({ firstName: 'asc', lastName: 'asc' });
//         res.json({ data: data })
//     }
//     catch (error) {
//         res.status(500).json({ message: error.message })
//     }
// })

// router.post('/contact', async (req, res) => {
//     try {
//         const data = await contactModel.findOne({ "userId": req.body.userId }, 'secPhone primEmail secEmail bio bday twitter facebook linkedin pinterest google meeting');
//         res.json({ data: data })
//     }
//     catch (error) {
//         res.status(500).json({ message: error.message })
//     }
// })

// router.get('/search', async (req, res) => {
//     try {
//         const regex = new RegExp(req.query.search, 'i'); // Create a case-insensitive regular expression pattern

//         let param = [];
//         if (isNaN(req.query.search))
//             param = [{ firstName: regex }, { lastName: regex }, { primEmail: regex }, { secEmail: regex }]
//         else
//             param = [{ primPhone: regex }, { secPhone: regex }, { primEmail: regex }, { secEmail: regex }]

//         // Search for contacts matching the query in various fields
//         const data = await contactModel.find({ $or: param }, 'userId avatar online firstName lastName jobPos primPhone').sort({ firstName: 'asc', lastName: 'asc' });

//         res.json({ data: data });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

// router.get('/isUsernameAvailable/:find', async (req, res) => {
//     try {
//         let params = req.params.find.split('~');
//         const data = await userModel.findOne({ $or: [{ "userName": params[0] }, { "email": params[1] }] }, 'userName email');
//         res.json(data)
//     }
//     catch (error) {
//         res.status(500).json({ message: error.message })
//     }
// });

router.post('/register', async (req, res) => {
    const data = new userModel({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        userName: req.body.userName,
        password: req.body.password,
    });

    // res.send(data.save());
    data.save()
        .then(savedData => {
            // res.json(savedData);
            res.json({ message: "successful" });
        })
        .catch(error => {
            if (error.name === 'MongoServerError' && error.code === 11000) {
                if (error.keyPattern.email || error.keyPattern.userName) {
                    res.json({ ...error.keyPattern });
                } else {
                    res.status(500).json({ error: 'An internal server error occurred.' });
                }
            } else {
                console.error(error);
                res.status(500).json({ error: 'An internal server error occurred.', errorCode: error.code, errorName: error.name });
            }
        });
});

router.get('/login', async (req, res) => {
    try {
        if (req.session.user) {
            res.send({ loggedIn: true, user: req.session.user })
        }
        else {
            res.send({ loggedIn: false })
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
});

router.post('/login', async (req, res) => {
    try {
        const data = await userModel.findOne({ "userName": req.body.userName });

        if (data) {
            if (data.password === req.body.password) {
                req.session.user = { ...data._doc, "password": undefined, "__v": undefined };
                res.send({ loggedIn: true, data: { ...data._doc, "password": undefined, "__v": undefined } })
            }
            else {
                res.send({ password: "Password is incorrect" })
            }
        }
        else {
            res.send({ userName: "Username doesn't exist" })
        }
    }
    catch (error) {
        res.status(500).send({ message: error.message })
    }
});

router.delete('/logout', async (req, res) => {
    try {
        if (req.session) {
            res.clearCookie('userId');
            req.session.destroy(err => {
                if (err) {
                    res.send({ logout: false })
                } else {
                    res.send({ logout: true })
                }
            });
        } else {
            res.end()
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.post('/upload-profile-image', async (req, res) => {
    try {
        const base64Image = req.body.image.replace(/^data:image\/jpeg;base64,/, ''); // Remove data URL prefix
        const imageBuffer = Buffer.from(base64Image, 'base64');
        const filePath = path.resolve(__dirname, '..', 'uploads', 'profile-image', req.body.fileName + '.jpg'); // Specify the directory to save the image

        // Write the image buffer to the local file system
        fs.writeFileSync(filePath, imageBuffer);

        // console.log('Image saved locally:', filePath);

        // Optionally, you can save the file path or perform other operations here

        res.status(200).json({ uploaded: true });
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ error: 'Failed to upload image' });
    }
});

router.post('/upload-contact-image', async (req, res) => {
    try {
        const base64Image = req.body.image.replace(/^data:image\/jpeg;base64,/, '');
        const imageBuffer = Buffer.from(base64Image, 'base64');
        const filePath = path.resolve(__dirname, '..', 'uploads', 'contact-image', req.body.fileName + '.jpg');
        fs.writeFileSync(filePath, imageBuffer);
        res.status(200).json({ uploaded: true });
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ error: 'Failed to upload image' });
    }
});

router.post('/addcontact', async (req, res) => {
    const data = new contactModel({
        owner: req.body.owner,
        avatar: req.body.avatar,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        jobPos: req.body.jobPos,
        primPhone: req.body.primPhone,
        secPhone: req.body.secPhone,
        primEmail: req.body.primEmail,
        secEmail: req.body.secEmail,
        bio: req.body.bio,
        bday: req.body.bday,
        meeting: req.body.meeting,
        facebook: req.body.facebook,
        pinterest: req.body.pinterest,
        twitter: req.body.twitter,
        linkedin: req.body.linkedin,
        google: req.body.google,
        online: 'off',
    });

    data.save()
        .then(savedData => {
            // res.json(savedData);
            res.json({ success: true, data: { ...savedData._doc } });
        })
        .catch(error => console.error(error));
});

router.put('/updatecontact', async (req, res) => {
    try {

        const unsetData = Object.fromEntries(Object.entries(req.body).filter(([key, value]) => value === ''));
        const updateData = {...req.body};
        delete updateData['_id'];
        // Remove keys from updateData if they exist in unsetData
        Object.keys(unsetData).forEach((key) => {
            if (key in updateData) {
                delete updateData[key];
            }
        });

        const updatedData = await contactModel.updateOne(
            { _id: req.body._id },
            {
                $set: updateData,
                $unset: unsetData,
            }
        );
        res.json({ data: updatedData })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
});

router.get('/contacts', async (req, res) => {
    try {
        const data = await contactModel.find({ owner: req.session.user["_id"] }, 'avatar online firstName lastName jobPos primPhone').sort({ firstName: 'asc', lastName: 'asc' });
        res.json({ data: data })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
});

router.post('/contact', async (req, res) => {
    try {
        const data = await contactModel.findOne({ _id: req.body._id }, 'secPhone primEmail secEmail bio bday twitter facebook linkedin pinterest google meeting');
        res.json({ data: data })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
});

router.get('/search', async (req, res) => {
    try {
        const regex = new RegExp(req.query.search, 'i'); // Create a case-insensitive regular expression pattern

        let param = [];
        if (isNaN(req.query.search))
            param = [{ firstName: regex }, { lastName: regex }, { primEmail: regex }, { secEmail: regex }]
        else
            param = [{ primPhone: regex }, { secPhone: regex }, { primEmail: regex }, { secEmail: regex }]

        // Search for contacts matching the query in various fields
        const data = await contactModel.find({ $and: [{ owner: req.session.user["_id"] }, { $or: param }] }, 'userId avatar online firstName lastName jobPos primPhone').sort({ firstName: 'asc', lastName: 'asc' });

        res.json({ data: data });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// router.get('/user/:username', async (req, res) => {
//     try {
//         const data = await userModel.findOne({ "userName": req.params.username });
//         req.session.userName = data["userName"];
//         res.json(data)
//     }
//     catch (error) {
//         res.status(500).json({ message: error.message })
//     }
// });

// //Update by ID Method
// router.patch('/update/:id', async (req, res) => {
//     try {
//         const id = req.params.id;
//         const updatedData = req.body;
//         const options = { new: true };

//         const result = await userModel.findByIdAndUpdate(
//             id, updatedData, options
//         )

//         res.send(result)
//     }
//     catch (error) {
//         res.status(400).json({ message: error.message })
//     }
// })

// //Delete by ID Method
// router.delete('/delete/:id', async (req, res) => {
//     try {
//         const id = req.params.id;
//         const data = await userModel.findByIdAndDelete(id)
//         res.send(`Document with ${data.name} has been deleted..`)
//     }
//     catch (error) {
//         res.status(400).json({ message: error.message })
//     }
// })

module.exports = router;