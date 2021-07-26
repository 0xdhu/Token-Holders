const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    holderAddress: {
        type: String,
        required: true,
        unique: true,        
    },
    contractAddress: String,
    eventBlockNumber: Number,
});

const model = mongoose.model("holders", schema);

module.exports.updateData = async (query, data) => {
    try {
      const update = data;
      const options = { upsert: true, new: true, setDefaultsOnInsert: true };
  
      const doc = await model.findOneAndUpdate(query, update, options);
      return doc;
    } catch (error) {
      throw new Error(error.message);
    }
  };
  
  module.exports.findData = async (query) => {
    try {
      const data = await model.find(query);
      return data;
    } catch (error) {
      throw new Error(error.message);
    }
  };
  
  module.exports.findOne = async (query) => {
    try {
      const data = await model.findOne(query);
      return data;
    } catch (error) {
      throw new Error(error.message);
    }
  };
  
  module.exports.findMax = async (query) => {
    try {
        const data = await model.findOne(query).sort('-eventBlockNumber');
        if(data !== null) {
            return data.eventBlockNumber;
        } return 0;
    } catch (error) {
        throw new Error(error.message);
    }
  }
  module.exports.HolderSchema = model;