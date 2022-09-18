'use strict'

class CestovniPojisteni extends Pojisteni {
    constructor(sumInsured, validFrom, validTo, placeOfStay, typeOfInsurance, id) {
        super(sumInsured, validFrom, validTo, typeOfInsurance, id)

        
            this.travelInsurance= {
                placeOfStay: placeOfStay,
                typeOfInsurance: "Cestovní Pojištění",
                sumInsured,
                validFrom,
                validTo,
                id
            }

        
    }
}