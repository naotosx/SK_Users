sap.ui.define(["sap/ui/model/json/JSONModel", "sap/ui/Device"], function (JSONModel, Device) {
	"use strict";

	return {
		/**
		 * Provides runtime info for the device the UI5 app is running on as JSONModel
		 */
		createDeviceModel: function () {
			var oModel = new JSONModel(Device);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},
		createDefaultData: function () {
			var data = {
				sistemas: [
					{
						id: "ECC",
						txt: "SAP"
					},
					{
						id: "BW",
						txt: "BW"
					},
					{
						id: "SOLMAN",
						txt: "SOLMAN"
					}
				],
				ambientes: [
					{
						id: "DEV",
						txt: "DEV"
					},
					{
						id: "QAS",
						txt: "QAS"
					},
					{
						id: "PRD",
						txt: "PRD"
					}
				],
				mail: "",
				change_pass_system: "ECC",
				change_pass_enviroment: "DEV",
				unlock_system: "ECC",
				unclock_enviroment: "DEV"
			};
            return new JSONModel(data);
		}
	};
});
