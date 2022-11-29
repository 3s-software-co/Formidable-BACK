const Response = require("../models/Response");
const Form = require("../models/Form");

exports.getResponses = (req, res) => {
  Response.find()
    .sort({ createdAt: -1 })
    .then((responses) => res.status(200).send(responses))
    .catch((err) => res.status(400).send(err));
};

exports.create = (req, res) => {
  const response = new Response({ ...req.body });
  response
    .save()
    .then((response) => {
      Form.findById(response.form_id).then((form) => {
        form.responses
          ? form.responses.push(response._id)
          : (form.responses = [response._id]);
        form.save();
      });
    })
    .then(() => res.sendStatus(200))
    .catch((err) =>
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while creating a create operation",
      })
    );
};

exports.getResponsesByForm = (req, res) => {
  const form_id = req.params.form_id;
  Response.find({ form_id })
    .sort({ createdAt: -1 })
    .then((responses) => res.status(200).send(responses))
    .catch((err) => res.status(400).send(err));
};
