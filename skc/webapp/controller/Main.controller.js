sap.ui.define(["sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel", "sap/m/MessageToast", "chgunlckusers/skc/model/models"], function (
    Controller,
    JSONModel,
    MessageToast,
    models
) {
    "use strict";

    return Controller.extend("chgunlckusers.skc.controller.Main", {
        onInit: function () {
            this.getView().setModel(models.createDefaultData(), "dataModel");
        },
        onCambiarClave: function () {
            var data = this.getView().getModel("dataModel").getData();
            MessageToast.show('Sistema : ' + data.change_pass_system + '. Ambiente : ' + data.change_pass_enviroment);
            this.sendRequest('2', data.change_pass_enviroment);
        },
        onDesbloquearClave: function () {
            var data = this.getView().getModel("dataModel").getData();
            MessageToast.show('Sistema : ' + data.unlock_system + '. Ambiente : ' + data.unclock_enviroment);
            this.sendRequest('1', data.unclock_enviroment);
        },
        sendRequest: function (accion, enviroment) {
            var data = this.getView().getModel("dataModel").getData(),
                system = accion === '1' ? data.unlock_system : data.change_pass_system,
                idioma = this.obtenerCodigoIdiomaInternacional(),
                endpoint = this.getDestination(enviroment);

            // Construcción del SOAP envelope
            var sSoapEnvelope =
                `<?xml version="1.0" encoding="UTF-8"?>
                    <soapenv:Envelope
                        xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                        xmlns:man="urn:skc.cl/mantenimiento_usuario_sap">
                        <soapenv:Header/>
                        <soapenv:Body>
                            <man:MT_mantenimiento_usuario_request>
                                <item>
                                    <smtpaddr>pablo.cabez@skconverge.com</smtpaddr>
                                    <idioma>${idioma}</idioma>
                                    <accion>${accion}</accion>
                                    <sistema>${system}</sistema>
                                </item>
                            </man:MT_mantenimiento_usuario_request>
                        </soapenv:Body>
                    </soapenv:Envelope>`;

            // Llamada al destination configurado como proxy
            fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "text/xml",
                    "Accept": "text/xml"
                },
                body: sSoapEnvelope
            })
                .then(response => response.text())
                .then(data => {
                    console.log("SOAP Response: ", data);
                    sap.m.MessageToast.show("Solicitud enviada correctamente");
                })
                .catch(err => {
                    console.error("SOAP Error: ", err);
                    sap.m.MessageToast.show("Error al enviar solicitud");
                });
        },
        getDestination: function (enviroment) {
            let endpoint = '';
            switch (enviroment) {
                case 'DEV':
                    endpoint = '/api/soapDEV';
                        break;
                case 'QAS':
                    endpoint = '/api/soapQAS';
                        break;
                case 'PRD':
                    endpoint = '/api/soapPRD';
                        break;
            }
            return endpoint;
        },
         obtenerCodigoIdiomaInternacional: function () {
            // navigator.language devuelve el código principal, ej: "es-CL" o "en-US".
            const idiomaCompleto = navigator.language;

            const idiomaBase = idiomaCompleto.slice(0, 2).toLowerCase();

            let codigo_internacional = '';

            switch (idiomaBase) {
                case 'en':
                    codigo_internacional = 'EN'; // Inglés
                    break;
                case 'es':
                    codigo_internacional = 'ES'; // Español
                    break;
                case 'pt':
                    codigo_internacional = 'PT'; // Portugués
                    break;
                case 'fr':
                    codigo_internacional = 'FR'; // Francés
                    break;
                case 'th':
                    codigo_internacional = 'TH'; // Tailandés...
                    break;
                default:
                    codigo_internacional = `EN`;
            }

            return codigo_internacional;
        }
    });
});

/*jQuery.ajax({
                url : '/XISOAPAdapter/MessageServlet',
                type : "POST",
                host : 'http://sk2wdp.sk.cl:8054',
                data : sSoapEnvelope,
                dataType : "text",
                contentType: "text/xml; charset=utf-8",
                success : function(data, textStatus, jqXHR) {
                    debugger;
                    console.log(data);
                }.bind(this),
                error : function(e) {
                    console.log(e);
                }.bind(this)
            })*/