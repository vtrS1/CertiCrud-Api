import { User } from "../models";
import * as Yup from "yup";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { differenceInHours } from "date-fns";
import Mail from "../libs/Mail";

class UserController {
  async login(req, res) {
    try {
      const schema = Yup.object().shape({
        email: Yup.string()
          .email("E-mail inválido")
          .required("E-mail é obrigatório!"),
        password: Yup.string().required("Senha é obrigatório"),
      });

      await schema.validate(req.body);

      const user = await User.findOne({ where: { email: req.body.email } });

      if (!user) {
        return res.status(401).json({ error: "E-mail ou senha não conferem." });
      }

      const checkPassword = await bcrypt.compare(
        req.body.password,
        user.password_hash
      );

      if (!checkPassword) {
        return res.status(401).json({ error: "E-mail ou senha não conferem." });
      }

      const token = jwt.sign({ id: user.id }, process.env.JWT_HASH, {
        expiresIn: "30d",
      });

      const { id, name, email, avatar_url, createdAt } = user;

      return res.json({
        user: {
          id,
          name,
          email,
          avatar_url,
          createdAt,
        },
        token,
      });
    } catch (error) {
      return res.status(400).json({ error: error?.message });
    }
  }

  async create(req, res) {
    try {
      const schema = Yup.object().shape({
        name: Yup.string()
          .required("Nome é obrigatório.")
          .min(3, "Nome deve conter ao menos 3 caracteres"),
        email: Yup.string()
          .email("E-mail inválido")
          .required("E-mail é obrigatório!"),
        password: Yup.string()
          .required("Senha é obrigatório")
          .min(6, "Senha deve conter ao menos 6 caracteres."),
      });

      await schema.validate(req.body);

      const existedUser = await User.findOne({
        where: { email: req.body.email },
      });

      if (existedUser) {
        return res.status(400).json({ error: "Usuário já existe." });
      }

      const hashPassword = await bcrypt.hash(req.body.password, 8);

      const user = new User({
        ...req.body,
        password: "",
        password_hash: hashPassword,
      });

      await user.save();

      return res.json({ user });
    } catch (error) {
      return res.status(400).json({ error: error?.message });
    }
  }

  async getAll(req, res) {
    try {
      const user = await User.findAll();

      return res.json(user);
    } catch (error) {
      return res.status(400).json({ error: error?.message });
    }
  }

  async forgotPassword(req, res) {
    try {
      const schema = Yup.object().shape({
        email: Yup.string()
          .email("E-mail inválido")
          .required("E-mail é obrigatório!"),
      });

      await schema.validate(req.body);

      const user = await User.findOne({ where: { email: req.body.email } });

      if (!user) {
        return res.status(404).json({ error: "Usuário não existe!" });
      }

      const reset_password_token_sent_at = new Date();
      const token = Math.random().toString().slice(2, 8);
      const reset_password_token = await bcrypt.hash(token, 8);

      await user.update({
        reset_password_token_sent_at,
        reset_password_token,
      });

      const { email, name } = user;

      const mailResult = await Mail.sendForgotPasswordMail(email, name, token);

      if (mailResult?.error) {
        return res.status(400).json({ error: "E-mail não enviado" });
      }

      return res.json({ success: true });
    } catch (error) {
      return res.status(400).json({ error: error?.message });
    }
  }

  async resetPassword(req, res) {
    try {
      const schema = Yup.object().shape({
        email: Yup.string()
          .email("E-mail inválido")
          .required("E-mail é obrigatório!"),
        token: Yup.string().required("Token é obrigatório"),
        password: Yup.string()
          .required("Senha é obrigatório")
          .min(6, "Senha deve conter ao menos 6 caracteres."),
      });

      await schema.validate(req.body);

      const user = await User.findOne({ where: { email: req.body.email } });

      if (!user) {
        return res.status(404).json({ error: "Usuário não existe!" });
      }

      if (!user.reset_password_token && !user.reset_password_token_sent_at) {
        return res
          .status(404)
          .json({ error: "Alteração de senha não foi solicitada" });
      }

      const hoursDifference = differenceInHours(
        new Date(),
        user.reset_password_token_sent_at
      );

      if (hoursDifference > 3) {
        return res.status(401).json({ error: "Token expirado" });
      }

      const checkToken = await bcrypt.compare(
        req.body.token,
        user.reset_password_token
      );

      if (!checkToken) {
        return res.status(401).json({ error: "Token inválido!" });
      }

      const password_hash = await bcrypt.hash(req.body.password, 8);

      await user.update({
        password_hash,
        reset_password_token: null,
        reset_password_token_sent_at: null,
      });

      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(400).json({ error: error?.message });
    }
  }
  async updateUser(req, res) {
    try {
      const schema = Yup.object().shape({
        id: Yup.number().required("Id é obrigatório"),
        name: Yup.string(),
        email: Yup.string().email("E-mail inválido"),
      });

      await schema.validate(req.body);

      const user = await User.findOne({ where: { id: req.body.id } });

      if (!user) {
        return res.status(404).json({ error: "Usuário não existe!" });
      }

      await user.update({
        id: req?.body.id,
        name: req?.body.name,
        email: req?.body.email,
      });

      await user.save();

      return res.status(200).json({ success: "Usuário Alterado Com Sucesso" });
    } catch (error) {
      return res.status(400).json({ error: error?.message });
    }
  }
}

export default new UserController();
