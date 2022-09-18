'use strict'

class Pojisteni {
    constructor(sumInsured, validFrom, validTo, typeOfInsurance, insurance = typeOfInsurance, id) {

        
          insurance= {
                typeOfInsurance: typeOfInsurance,
                sumInsured: sumInsured,
                validFrom: validFrom,
                validTo: validTo,
                id: id
            }

        
    }
}

