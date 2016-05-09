import Message from '../models/message';
import _ from 'lodash';
import mailer from '../mailer/mailer';
import notifier from '../helpers/notifier';

/**
 * Load message and append to req.
 */
function load(req, res, next, id) {
    Message.get(id).then((message) => {
        req.message = message;
        return next();
    }).error((e) => next(e));
}

/**
 * Get message
 * @returns {Message}
 */
function get(req, res) {
    return res.json(req.message);
}

/**
 * Create new message
 * @property {string} req.body.messagename - The messagename of message.
 * @property {string} req.body.mobileNumber - The mobileNumber of message.
 * @returns {Message}
 */
function create(req, res, next) {
    const message = new Message({
        text: req.body.text,
        user: req.user.id
    });

    message.saveAsync()
        .then((savedMessage) => {
            //mailer.notifyAll("Message", {user: savedMessage.user, text: savedMessage.text})
            notifier.send("message", savedMessage);

            return res.json(savedMessage);
        })
        .error((e) => next(e));
}

/**
 * Get message list.
 * @property {number} req.query.skip - Number of messages to be skipped.
 * @property {number} req.query.limit - Limit number of messages to be returned.
 * @returns {Message[]}
 */
function list(req, res, next) {
    const { limit = 50, skip = 0, game, user } = req.query;
    Message.list({ limit, skip, game, user }).then((messages) =>  res.json(messages))
        .error((e) => next(e));
}

export default { get, create, list, load };