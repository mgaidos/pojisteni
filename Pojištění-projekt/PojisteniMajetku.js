'use strict'

class PojisteniMajetku extends Pojisteni {
    constructor(sumInsured, validFrom, validTo, subjectOfInsurace, typeOfInsurance, id) {
        super(sumInsured, validFrom, validTo,typeOfInsurance, id)

        
            this.propertyInsurance= {
                subjectOfInsurace: subjectOfInsurace,
                typeOfInsurance: "Pojištění majetku",
                sumInsured,
                validFrom,
                validTo,
                id
            }

        
    }
}