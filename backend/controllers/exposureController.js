const hibpService = require("../services/hibpService");

const scanEmail = async (req, res) => {

    try {

        const { email, phone } = req.body;

        if (!email && !phone) {
            return res.status(400).json({
                success: false,
                message: "Email or phone is required"
            });
        }

        console.log(`📨 Request received for email: ${email}`);
        console.log(`📱 Request received for phone: ${phone}`);

        let emailData = null;
        let phoneData = null;

        // ✅ Email check
        if (email) {
            emailData = await hibpService.checkEmailExposure(email);
        }

        // ✅ Phone check
        if (phone) {
            phoneData = await hibpService.checkPhoneExposure(phone);
        }

       const responseData = {
    success: true,
    email: email || null,
    phone: phone || null,

    emailExposure: emailData
        ? {
            totalBreaches: emailData.totalBreaches,
            riskLevel: emailData.riskLevel,
            exposureScore: emailData.exposureScore,
            containsSensitiveData: emailData.containsSensitiveData,
            leakedFields: emailData.leakedFields,
            sources: emailData.sources || []   // ✅ FIXED
        }
        : null,

    phoneExposure: phoneData
        ? {
            totalBreaches: phoneData.totalBreaches,
            riskLevel: phoneData.riskLevel,
            exposureScore: phoneData.exposureScore,
            containsSensitiveData: phoneData.containsSensitiveData,
            leakedFields: phoneData.leakedFields,
            sources: phoneData.sources || []   // ✅ FIXED
        }
        : null
};
        console.log("📤 Sending Response:", JSON.stringify(responseData, null, 2));

        res.status(200).json(responseData);

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

module.exports = {
    scanEmail
};