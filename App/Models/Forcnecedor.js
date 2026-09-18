const Connection = require('../../Lib/Database/Connection');
const Criteria = require('../../Lib/Database/Criteria');
const Record = require('../../Lib/Database/Record');
const Repository = require('../../Lib/Database/Repository');
const Transaction = require('../../Lib/Database/Transaction');

const db = Connection.getInstance();

class Fornecedor extends Record{}

