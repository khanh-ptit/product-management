const mongooose = require("mongoose")

const settingGeneralSchema = new mongooose.Schema({
    websiteName: String,
    favicon: String,
    logo: String,
    phone: String,
    email: String,
    address: String,
    copyright: String
})

const SettingGeneral = mongooose.model("SettingGeneral", settingGeneralSchema, "settings-general")

module.exports = SettingGeneral