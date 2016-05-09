import request from 'superagent-bluebird-promise';
import config from '../../config/env';

function send(channel, data) {
    const body = {
        channel: channel,
        data: data
    }
    try {
        request.post(config.webUrl + '/notifier/update')
            .set('Content-Type', 'application/json')
            .send(body)
            .then((response) => {
                console.log("OK");
                return;
            })
    } 
    catch (e) {
        console.log("error in notification", e);
    }
}

export default { send }