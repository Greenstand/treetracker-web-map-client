/*
 * get entity, edit the DOM
 */
import axios from 'axios';

const treetrackerApiUrl = process.env.NEXT_PUBLIC_API || '/api/web/';

const entity = {
  name: 'entity',
  async getById(id) {
    const res = await axios.get(`${treetrackerApiUrl}entities/${id}`);
    if (res.status !== 200) {
      throw Error('entity load fails');
    }
    return res.data;
  },
  async getByWallet(name) {
    const res = await axios.get(`${treetrackerApiUrl}entities?wallet=${name}`);
    if (res.status !== 200) {
      throw Error('entity load fails');
    }
    return res.data;
  },
  async getByMapName(name) {
    const res = await axios.get(
      `${treetrackerApiUrl}entities?map_name=${name}`,
    );
    if (res.status !== 200) {
      throw Error('entity load fails');
    }
    return res.data;
  },
};

export default entity;
