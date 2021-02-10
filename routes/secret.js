const secrets = {
    uri: "mongodb+srv://readOnly:readOnly@cluster0.mvmp6.mongodb.net/APSB?retryWrites=true&w=majority"
  };
  
  const getSecret = key => secrets[key];
  
  module.exports = getSecret;