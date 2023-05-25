import NodeMailJet from "node-mailjet";

const mailJet = NodeMailJet.apiConnect(
  process.env.API_KEY,
  process.env.SECRET_KEY
);

class Mail {
  async sendForgotPasswordMail(email, name, token) {
    try {
      const result = await mailJet.post("send", { version: "v3.1" }).request({
        Messages: [
          {
            From: {
              Email: "sistemas.rh@novaeranet.com.br",
              Name: "Esqueceu sua senha",
            },
            To: [
              {
                Email: email,
                Name: name,
              },
            ],
            TemplateID: 4832628,
            TemplateLanguage: true,
            Subject: "Alteracao de senha",
            Variables: {
              name: name,
              token: token,
            },
          },
        ],
      });

      console.log(result.body);

      return result;
    } catch (error) {
      return { error };
    }
  }
}

export default new Mail();
