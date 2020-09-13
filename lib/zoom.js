const Token = 'token'
const axios = require('axios');
const userId = 'userId';
const header = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${Token}`
}
class ZoomController {
  meetingGen = async (data) => {
    const create = await axios.post(`https://api.zoom.us/v2/users/${userId}/meetings`, data,{ headers : header })
    .then(res =>{
      console.log(res.data);
      return res.data
    })
    .catch(err => {
      console.log(err);
      return err
    });
    return create
  }

  getAllMetting = async () => {
    const create = await axios.get(`https://api.zoom.us/v2/users/${userId}/meetings`,{ headers : header })
    .then(res =>{
      console.log(res.data);
      return res.data
    })
    .catch(err => {
      console.log(err);
      return err
    });
    return create
  }
}
const zoom = new ZoomController();
module.exports = zoom;