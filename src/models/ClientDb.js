const {Schema, model} = require('mongoose');

const ClientSchema = new Schema({
    clientName: {
        type: String,
        required: true
    },
    contactName: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    cuit: {
        type: String,
        required: true
    },
    service: [{
        name: {
          type: String,
          required: true
        },
        date: {
          type: Date,
          required: true,
          // default: Date.now
        },
        renew: {
          type: Date,
          // default: () => {
          //   const oneYearFromNow = new Date();
          //   oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
          //   return oneYearFromNow;
          // }
        },
        price: {
          type: Number,
        },
        description: {
          type: String,
        },
        payments: [{
          paymentMethod: {
            type: String,
          },
          details: {
            type: String,
          },
          price: {
            type: Number,
          },
          currency: {
            type: String,
          },
          date: {
            type: Date,
          }
        }]
      }],
    // clientCreated: {
    //     timestamps: true
    // },
    user: {
        type: String,
        required: true
    }
}
// ,
// {   timestamps: true
// }
) 

module.exports = model('Client', ClientSchema, 'Client List')
