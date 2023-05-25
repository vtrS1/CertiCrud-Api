import { Candidates } from "../models";
import * as Yup from "yup";

class CandidatesController {
  async create(req, res) {
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required("Nome é obrigatório."),
        phonenumber: Yup.string().required("Telefone é obrigatório."),
        email: Yup.string().required("E-mail é obrigatório."),
        salaryclaim: Yup.string().required("Pretensão salarial é obrigatório."),
        city: Yup.string().required("Cidade é obrigatório."),
        vacancy: Yup.string().required("Vaga é obrigatório."),
      });

      await schema.validate(req.body);

      const candidate = new Candidates({
        ...req.body,
      });
      candidate.save();

      return res.json("Usuário criado com sucesso.");
    } catch (error) {
      return res.status(400).json({ error: error?.message });
    }
  }

  async getAll(req, res) {
    try {
      const candidates = await Candidates.findAll();
      return res.json(candidates);
    } catch (error) {
      return res.status(400).json({ error: error?.message });
    }
  }

  async update(req, res) {
    try {
      const schema = Yup.object().shape({
        id: Yup.number().required("Id é obrigatório"),
        name: Yup.string(),
        phonenumber: Yup.string(),
        email: Yup.string().email("E-mail inválido"),
        salaryclaim: Yup.string(),
        city: Yup.string(),
        vacancy: Yup.string(),
      });

      await schema.validate(req.body);

      const candidate = await Candidates.findOne({
        where: { id: req.body.id },
      });

      if (!candidate) {
        return res.status(404).json({ error: "Candidato não existe!" });
      }

      await candidate.update({
        id: req?.body.id,
        name: req?.body.name,
        email: req?.body.email,
        phonenumber: req?.body.phonenumber,
        salaryclaim: req?.body.salaryclaim,
        city: req?.body.city,
        vacancy: req?.body.vacancy,
      });

      await candidate.save();

      return res
        .status(200)
        .json({ success: "Dados do candidato alterados com sucesso" });
    } catch (error) {
      return res.status(400).json({ error: error?.message });
    }
  }

  async delete(req, res) {
    try {
      const schema = Yup.object().shape({
        id: Yup.number().required("Id é obrigatório"),
      });

      await schema.validate(req.body);

      const candidate = await Candidates.findOne({
        where: { id: req.body.id },
      });

      if (!candidate) {
        return res.status(404).json({ error: "Candidato não existe!" });
      }

      await candidate.destroy();

      return res
        .status(200)
        .json({ success: "Candidato deletado com sucesso" });
    } catch (error) {
      return res.status(400).json({ error: error?.message });
    }
  }
}

export default new CandidatesController();
