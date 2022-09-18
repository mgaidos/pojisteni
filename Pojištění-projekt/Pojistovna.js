'use strict'

class Pojistovna {
    constructor() {
        this.dataFromLocalStorage = JSON.parse(localStorage.getItem("data"))
        this.dataOfTheInsured = this.dataFromLocalStorage ? this.dataFromLocalStorage : []

        /**Inputs - vytvorPojisteni.html */
        this.name = document.getElementById("first-name")
        this.secondName = document.getElementById("second-name")
        this.email = document.getElementById("email")
        this.phone = document.getElementById("phone-number")
        this.street = document.getElementById("street-house-number")
        this.city = document.getElementById("city")
        this.postalCode = document.getElementById("postal-code")

        /** Inputs vyberPojisteni.html */
        this.selectInsurance = document.getElementById("select-insurance")


        /**Inputs - seznamPojistencu.html */
        if (window.location.pathname == "/seznamPojistencu.html") {

            this.tableOfInsured = document.getElementById("description-of-insured")
        }

        /** Buttons - vytvorPojisteni.html*/
        this.continueButton = document.getElementById("continue-button")

        /** vyberPojisteni.html*/
        if (window.location.pathname == "/vyberPojisteni.html") {

            this.submitInsuredButton = document.getElementById("submit-insured-button")
            this.backButton = document.getElementById("back-button")
            this.backToCreateInsured()
            this.addInsurance(this.submitInsuredButton)
        }

        this.listTheInsured()

        window.onload = () => {
            this.createInsured()

        }

    }

    validateInsured(continueOrConfirmButton, name, secondName, email, phone, street, city, postalCode, IdOfInsured, anchor) {

        function valdidate(idOfInput, errorValue, invalidInput) {
            let invalidElement = document.querySelector(invalidInput)
            invalidElement.style.border = "thin solid red"
            let nameError = document.getElementById(idOfInput)
            nameError.innerHTML = ""
            let error = document.createElement("p")
            error.style.color = "red"
            error.innerHTML = new Error(errorValue)
            nameError.insertAdjacentElement("afterbegin", error)
            return


        }


        continueOrConfirmButton.addEventListener("click", () => {

            if (!name.value.trim() || !secondName.value.trim() || !(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/).test(email.value.trim()) || !(/^\d{9}$/).test(phone.value) || !street.value.trim() || !city.value.trim() || !(/^\d{5}$/).test(postalCode.value)) {

                document.getElementById("name-error").innerHTML = ""
                document.getElementById("second-name-error").innerHTML = ""
                document.getElementById("email-error").innerHTML = ""
                document.getElementById("phone-error").innerHTML = ""
                document.getElementById("street-house-number-error").innerHTML = ""
                document.getElementById("city-error").innerHTML = ""
                document.getElementById("postal-code-error").innerHTML = ""


                if (name.value.trim()) {

                } else {
                    valdidate("name-error", "Zadejte jméno!", '[name="first-name"]')
                }

                if (secondName.value.trim()) {

                } else {
                    valdidate("second-name-error", "Zadejte příjmení!", '[name="second-name"]')
                }

                if ((/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/).test(email.value.trim())) {

                } else {
                    valdidate("email-error", "Zadejte email ve správné formátu!", '[name="email"]')
                }

                if ((/^\d{9}$/).test(phone.value)) {

                } else {
                    valdidate("phone-error", "Zadejte telefonní číslo ve správné formátu!", '[name="phone"]')
                }

                if (street.value.trim()) {

                } else {
                    valdidate("street-house-number-error", "Zadejte ulici a číslo domu!", '[name="street"]')
                }

                if (city.value.trim()) {

                } else {
                    valdidate("city-error", "Zadejte město!", '[name="city"]')
                }

                if ((/^\d{5}$/).test(postalCode.value)) {

                } else {
                    valdidate("postal-code-error", "Zadejte PSČ ve správném formátu!", '[name="postal-code"]')
                }

            } else {
                if (continueOrConfirmButton.classList.contains("confirm")) {


                    const editingInsured = this.dataOfTheInsured.filter(element => { return element.id == IdOfInsured })
                    const insurancesOfEditingInsured = editingInsured[0].dataOfInsurance

                    this.dataOfTheInsured = this.dataOfTheInsured.filter(element => { return element.id != IdOfInsured })

                    const pojistenec = new Pojistenec(
                        name.value.trim(), secondName.value.trim(), email.value.trim(), phone.value.trim(), street.value.trim(), city.value.trim(), postalCode.value.trim(), IdOfInsured
                    )
                    pojistenec.dataOfInsurance = insurancesOfEditingInsured

                    localStorage.removeItem("data")
                    this.tableOfInsured.lastChild.innerHTML = ""
                    this.dataOfTheInsured.push(pojistenec)
                    this.saveTheDataOfInsured()
                    this.listTheInsured()



                    if (anchor) {
                        window.location.href = anchor
                    }
                } else {

                    const pojistenec = new Pojistenec(
                        name.value.trim(), secondName.value.trim(), email.value.trim(), phone.value.trim(), street.value.trim(), city.value.trim(), postalCode.value.trim(), IdOfInsured
                    )
                    this.dataOfTheInsured.push(pojistenec)
                    this.saveTheDataOfInsured()

                    if (anchor) {
                        window.location.href = anchor
                    }
                }


            }

        })
    }



    createInsured() {
        this.validateInsured(this.continueButton, this.name, this.secondName, this.email, this.phone, this.street, this.city, this.postalCode, Math.ceil(Math.random() * 1000000), "vyberPojisteni.html")
    }



    //This method add last created insurance to the last created insured 
    addInsuranceToInsured(insurance) {

        let items = JSON.parse(localStorage.getItem("data"))
        let edited = items[items.length - 1]
        edited.dataOfInsurance.push(insurance)
        //delete last item
        items.splice(-1, 1)
        //Replacing a deleted object with a new one consisting of the original object + the insurance object.
        items.push(edited)
        //localStorage.clear()
        localStorage.setItem("data", JSON.stringify(items))
    }



    /** This method shifts back from vyberPojisteni.html to vytvorPojisteni.html when the zpět button is clicked  */
    backToCreateInsured() {
        this.backButton.onclick = () => {
            window.history.back()
            removeLastItem()

        }
        /** This function prevents to make twice the same insured when you click on "Zpět" button and then back to "Pokračovat" button. */
        const removeLastItem = () => {
            let items = JSON.parse(localStorage.getItem("data"))
            items.splice(-1, 1)
            localStorage.clear()
            localStorage.setItem("data", JSON.stringify(items))
        }

    }

    /*This method save the data of the insured to the localStorage */
    saveTheDataOfInsured() {
        this.dataOfTheInsured = this.dataOfTheInsured.filter(element => { return element != null })

        localStorage.setItem("data", JSON.stringify(this.dataOfTheInsured))
    }

    /** This method lists the records to a table*/
    listTheInsured() {
        /**This condition is waiting to be loaded on the insured listing page. */
        if (window.location.pathname == "/seznamPojistencu.html") {
            /**This condition is waiting for the DOM of the page.*/
            let tableBody = document.createElement("tbody")
            tableBody.setAttribute("class", "thead-of-description")

            this.sortInsured()

            let obj = this.dataOfTheInsured

            for (let item of obj) {
                let editButton = document.createElement("button")
                editButton.textContent = "Edit"
                editButton.setAttribute("class", "table-buttons edit-button")

                let detailButton = document.createElement("button")
                detailButton.textContent = "Detail"
                detailButton.setAttribute("class", "table-buttons detail-button")

                detailButton.addEventListener("click", () => {
                    let selectedRow = detailButton.parentElement.parentElement
                    let body = document.querySelectorAll(".thead-of-description")[1]

                    let idOfInsured = selectedRow.childNodes[4].innerText

                    if (detailButton.classList.contains("clicked-detail")) {
                        detailButton.classList.remove("clicked-detail")
                        selectedRow.removeChild(selectedRow.childNodes[7])
                    } else if (editButton.classList.contains("clicked-edit")) {
                        editButton.classList.remove("clicked-edit")
                        selectedRow.removeChild(selectedRow.childNodes[7])
                        detailButton.classList.add("clicked-detail")
                        this.showDetail(detailButton, selectedRow)
                    } else {
                        detailButton.classList.add("clicked-detail")
                        this.showDetail(detailButton, selectedRow)

                        for (let i = 0; i < body.childNodes.length; i++) {
                            if (idOfInsured != body.childNodes[i].childNodes[4].innerText && body.childNodes[i].childNodes[7]) {

                                //remove class clicked-detail from detail button
                                body.childNodes[i].childNodes[6].childNodes[2].classList.remove("clicked-detail")

                                //remove class clicked-edit from the previous clicked editbutton
                                if (body.childNodes[i].childNodes[6].childNodes[1].classList.contains("clicked-edit")) {
                                    body.childNodes[i].childNodes[6].childNodes[1].classList.remove("clicked-edit")
                                }
                                //remove detail div
                                body.childNodes[i].childNodes[7].remove()
                            }
                        }
                    }
                })

                let deleteButton = document.createElement("button")
                deleteButton.textContent = "Delete"
                deleteButton.setAttribute("class", "table-buttons delete-button")
                deleteButton.addEventListener("click", () => {
                    this.deleteInsured(deleteButton)
                })

                editButton.addEventListener("click", () => {
                    let selectedRow = editButton.parentElement.parentElement

                    let body = document.querySelectorAll(".thead-of-description")[1]

                    let idOfInsured = selectedRow.childNodes[4].innerText

                    if (editButton.classList.contains("clicked-edit")) {
                        editButton.classList.remove("clicked-edit")
                        selectedRow.removeChild(selectedRow.childNodes[7])
                    } else if (detailButton.classList.contains("clicked-detail")) {
                        detailButton.classList.remove("clicked-detail")
                        selectedRow.removeChild(selectedRow.childNodes[7])
                        editButton.classList.add("clicked-edit")
                        this.editInsured(editButton, selectedRow)
                    } else {
                        editButton.classList.add("clicked-edit")
                        this.editInsured(editButton, selectedRow)

                        for (let i = 0; i < body.childNodes.length; i++) {
                            if (idOfInsured != body.childNodes[i].childNodes[4].innerText && body.childNodes[i].childNodes[7]) {

                                //remove class clicked-edit from edit button
                                body.childNodes[i].childNodes[6].childNodes[1].classList.remove("clicked-edit")

                                //remove class clicked-detail from the previous clicked detail button
                                if (body.childNodes[i].childNodes[6].childNodes[2].classList.contains("clicked-detail")) {
                                    body.childNodes[i].childNodes[6].childNodes[2].classList.remove("clicked-detail")
                                }
                                //remove editing div
                                body.childNodes[i].childNodes[7].remove()
                            }
                        }
                    }
                })

                let tableRow = document.createElement("tr")
                let tableData = document.createElement("td")
                tableRow.setAttribute("class", "tr-of-description")
                tableRow.innerHTML =
                    `<td>
                    ${item.name} ${item.secondName}
                </td>
                <td>${item.street}, 
                    ${item.city} 
                    ${item.postalCode}
                </td>
                <td id = "${item.id}">
                    ${item.id}               
                </td>
                `

                tableData.appendChild(deleteButton)
                tableData.appendChild(editButton)
                tableData.appendChild(detailButton)
                tableRow.appendChild(tableData)
                tableBody.appendChild(tableRow)
                this.tableOfInsured.appendChild(tableBody)
            }
        }
    }

    deleteInsurance(button) {

        //here's the id of the person I'm removing the insurance from
        const idOfInsured = button.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.childNodes[4].id

        //here is the id of the insurance I want to remove
        const idOfInsurance = button.parentElement.parentElement.childNodes[5].innerText

        //here is an object with the insurance object
        const arrayWithObject = this.dataOfTheInsured.filter(element => { return element.id == idOfInsured })

        for (let i = 0; i < arrayWithObject[0].dataOfInsurance.length; i++) {


            if (Object.keys(arrayWithObject[0].dataOfInsurance[i]).toString() === "travelInsurance") {
                if (arrayWithObject[0].dataOfInsurance[i].travelInsurance.id == idOfInsurance) {
                    arrayWithObject[0].dataOfInsurance.splice(i, 1)
                    break
                }
            } else if (Object.keys(arrayWithObject[0].dataOfInsurance[i]).toString() === "propertyInsurance") {
                if (arrayWithObject[0].dataOfInsurance[i].propertyInsurance.id == idOfInsurance) {
                    arrayWithObject[0].dataOfInsurance.splice(i, 1)
                    break
                }
            } else {

            }
        }

        this.dataOfTheInsured = this.dataOfTheInsured.filter(element => { return element.id != idOfInsured })

        this.dataOfTheInsured.push(arrayWithObject[0])

        this.saveTheDataOfInsured()

        const deletedRow = button.parentElement.parentElement

        deletedRow.remove()
        this.sortInsured()

    }

    editInsurance(button, selectedRow) {
        //here is the id of the person I am editing the insurance
        const idOfInsured = button.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.childNodes[4].id

        //here is the insurance id I want to edit
        const idOfInsurance = button.parentElement.parentElement.childNodes[5].innerText

        //here is the type of insurance I want to edit
        const typeofInsurance = button.parentElement.parentElement.childNodes[1].innerText

        //here is the human object with the insurenices I want to edit
        let editingInsured = this.dataOfTheInsured.filter(element => { return element.id == idOfInsured })


        //removes the edited insurance from the person array and stores it in a variable at the same time 
        let editingInsurance
        for (let i = 0; i < editingInsured[0].dataOfInsurance.length; i++) {


            if (Object.keys(editingInsured[0].dataOfInsurance[i]).toString() === "travelInsurance") {
                if (editingInsured[0].dataOfInsurance[i].travelInsurance.id == idOfInsurance) {
                    editingInsurance = editingInsured[0].dataOfInsurance[i]
                    break
                }
            } else if (Object.keys(editingInsured[0].dataOfInsurance[i]).toString() === "propertyInsurance") {
                if (editingInsured[0].dataOfInsurance[i].propertyInsurance.id == idOfInsurance) {
                    editingInsurance = editingInsured[0].dataOfInsurance[i]
                    break
                }
            } else {

            }
        }

        const divForEdit = document.createElement("div")
        divForEdit.setAttribute("id", "div-for-edit-button")

        let propertyElement = document.createElement("div")
        propertyElement.innerHTML =
            `
        <div id="personal-data">
        
        <p>Předmět pojištění</p>
        <span id="subject-of-insurance-error"></span>
        <input type="text" placeholder="Např: Byt - vyplňte pokud chcete pojistit majetek." id="subject-of-insurance">
        <p>Pojistná částka</p>
        <span id="sum-insured-error"></span>
        <input type="text" placeholder="Např: 2 500 000" id="sum-insured">
        <p>Platnost od</p>
        <span id="validity-from-error"></span>
        <input type="text" placeholder="Datum ve formátu: DD.MM.RRRR" id="validity-from">
        <p>Platnost do</p><span id="validity-to-error"></span>
        <input type="text" placeholder="Datum ve formátu: DD.MM.RRRR" id="validity-to">

        <button id= "submit-edit-button" class = "submit-edit-button">Uložit</button>
        </div>
        `

        let travelElement = document.createElement("div")
        travelElement.innerHTML =
            `
        <div id="personal-data">
        <p>Místo pobytu</p>
        <span id="place-of-stay-error"></span>
        <input type="text" placeholder="Např: USA - vyplňte pokud chcete cestovní pojištění." id="place-of-stay">
        <p>Pojistná částka</p>
        <span id="sum-insured-error"></span>
        <input type="text" placeholder="Např: 2 500 000" id="sum-insured">
        <p>Platnost od</p>
        <span id="validity-from-error"></span>
        <input type="text" placeholder="Datum ve formátu: DD.MM.RRRR" id="validity-from">
        <p>Platnost do</p>
        <span id="validity-to-error"></span>
        <input type="text" placeholder="Datum ve formátu: DD.MM.RRRR" id="validity-to">

        <button id= "submit-edit-button" class = "submit-edit-button">Uložit</button>
        </div>
        `
        let subjectOfInsurace
        let placeOfStay
        let sumInsured
        let validityFrom
        let validityTo

        let subjectInsuranceError
        let placeOfStayError
        let sumInsuredError
        let valididtyToError
        let valididtyFromError

        if (typeofInsurance === "Cestovní Pojištění") {
            divForEdit.innerHTML = travelElement.innerHTML
            selectedRow.insertAdjacentElement("beforeend", divForEdit)

            document.getElementById(`place-of-stay`).value = editingInsurance.travelInsurance.placeOfStay
            document.getElementById(`sum-insured`).value = editingInsurance.travelInsurance.sumInsured
            document.getElementById(`validity-from`).value = editingInsurance.travelInsurance.validFrom
            document.getElementById(`validity-to`).value = editingInsurance.travelInsurance.validTo

            const submitEditButton = document.getElementById(`submit-edit-button`)
            submitEditButton.addEventListener("click", () => {

                let editInsuranceTable = document.getElementById(`edit-table${idOfInsured}`)
                let tableBody = document.getElementById(`edit-insurance-tbody${idOfInsured}`)

                this.validateInsurance(typeofInsurance, idOfInsured, idOfInsurance)
                placeOfStay = document.getElementById("place-of-stay")
                sumInsured = document.getElementById("sum-insured")
                validityFrom = document.getElementById("validity-from")
                validityTo = document.getElementById("validity-to")

                placeOfStayError = document.getElementById("place-of-stay-error")
                sumInsuredError = document.getElementById("sum-insured-error")
                valididtyFromError = document.getElementById("validity-from-error")
                valididtyToError = document.getElementById("validity-to-error")

                if (placeOfStay.value && sumInsured.value && validityFrom.value && validityTo.value && !(placeOfStayError.value) && !(sumInsuredError.value) && !(valididtyFromError.value) && !(valididtyToError.value)) {
                    this.sortInsurance(idOfInsured, editInsuranceTable, tableBody)
                }
            })
        } else {
            divForEdit.innerHTML = propertyElement.innerHTML
            selectedRow.insertAdjacentElement("beforeend", divForEdit)


            document.getElementById(`subject-of-insurance`).value = editingInsurance.propertyInsurance.subjectOfInsurace
            document.getElementById(`sum-insured`).value = editingInsurance.propertyInsurance.sumInsured
            document.getElementById(`validity-from`).value = editingInsurance.propertyInsurance.validFrom
            document.getElementById(`validity-to`).value = editingInsurance.propertyInsurance.validTo


            const submitEditButton = document.getElementById(`submit-edit-button`)
            submitEditButton.addEventListener("click", () => {

                let editInsuranceTable = document.getElementById(`edit-table${idOfInsured}`)
                let tableBody = document.getElementById(`edit-insurance-tbody${idOfInsured}`)

                this.validateInsurance(typeofInsurance, idOfInsured, idOfInsurance)
                subjectOfInsurace = document.getElementById("subject-of-insurance")
                sumInsured = document.getElementById("sum-insured")
                validityFrom = document.getElementById("validity-from")
                validityTo = document.getElementById("validity-to")

                subjectInsuranceError = document.getElementById("subject-of-insurance-error")
                sumInsuredError = document.getElementById("sum-insured-error")
                valididtyFromError = document.getElementById("validity-from-error")
                valididtyToError = document.getElementById("validity-to-error")

                if (subjectOfInsurace.value && sumInsured.value && validityFrom.value && validityTo.value && !subjectInsuranceError.value && !sumInsuredError.value && !valididtyFromError.value && !valididtyToError.value) {
                    this.sortInsurance(idOfInsured, editInsuranceTable, tableBody)
                }
            })
        }

    }

    validateInsurance(typeOfInsurance, idOfInsured, idOfInsurance) {

        let propertyInsurance = "Pojištění majetku"
        let travelInsurance = "Cestovní pojištění"

        function valdidate(idOfInput, errorValue, invalidInput) {
            let invalidElement = document.getElementById(invalidInput)
            invalidElement.style.border = "thin solid red"
            let nameError = document.getElementById(idOfInput)
            nameError.innerHTML = ""
            let error = document.createElement("p")
            error.style.color = "red"
            error.innerHTML = new Error(errorValue)
            nameError.insertAdjacentElement("afterbegin", error)
            return
        }
        if (typeOfInsurance === "Pojištění majetku") {
            /** inputy */

            const subjectOfInsurance = document.getElementById(`subject-of-insurance`)
            const sumInsured = document.getElementById(`sum-insured`)
            let actualDate = this.returnCurrentTime()
            let validityFromDate = this.returnDateFrom()
            let validityToDate = this.returnDateTo()

            const validityFrom = document.getElementById(`validity-from`).value.toString()
            const validityTo = document.getElementById(`validity-to`).value.toString()

            document.getElementById("subject-of-insurance-error").innerHTML = ""
            document.getElementById("sum-insured-error").innerHTML = ""
            document.getElementById("validity-from-error").innerHTML = ""
            document.getElementById("validity-to-error").innerHTML = ""

            if (!subjectOfInsurance.value.trim() || !sumInsured.value.trim() || !(/^[0-9\s]*$/).test(sumInsured.value) || !(validityFromDate >= actualDate) || !validityFrom || !(validityToDate > validityFromDate) || !validityTo) {
                if (subjectOfInsurance.value.trim()) {

                } else {
                    valdidate("subject-of-insurance-error", "Vyplňte předmět pojištění!", "subject-of-insurance")
                }

                if (sumInsured.value.trim() && (/^[0-9\s]*$/).test(sumInsured.value)) {

                } else if (!sumInsured.value.trim()) {
                    valdidate("sum-insured-error", "Vyplňte pojistnou částku!", "sum-insured")
                } else {
                    valdidate("sum-insured-error", "Vyplňte pouze čísla!", "sum-insured")
                }

                if (validityFromDate >= actualDate && validityFrom) {

                } else if (validityFromDate <= actualDate) {
                    valdidate("validity-from-error", "Začátek musí být větší nebo rovno dnešnímu datu!", "validity-from")

                } else {
                    valdidate("validity-from-error", "Vyplňte začátek platnosti pojištění!", "validity-from")
                }

                if (validityToDate > validityFromDate && validityTo) {

                } else if (validityToDate <= validityFromDate) {
                    valdidate("validity-to-error", "Konec platnosti musí být větší než začátek!", "validity-to")
                } else {
                    valdidate("validity-to-error", "Vyplňte konec platnosti pojištění!", "validity-to")
                }
            } else {

                const pojisteniMajetku = new PojisteniMajetku(sumInsured.value, validityFrom, validityTo, subjectOfInsurance.value, propertyInsurance, idOfInsurance)

                const editingInsured = this.dataOfTheInsured.filter(element => { return element.id == idOfInsured })

                for (let i = 0; i < editingInsured[0].dataOfInsurance.length; i++) {

                    if (Object.keys(editingInsured[0].dataOfInsurance[i]).toString() === "propertyInsurance") {
                        if (editingInsured[0].dataOfInsurance[i].propertyInsurance.id == idOfInsurance) {


                            editingInsured[0].dataOfInsurance.splice(i, 1)
                            break
                        }
                    }
                }

                editingInsured[0].dataOfInsurance.push(pojisteniMajetku)

                const noEditingInsured = this.dataOfTheInsured.filter(element => { return element.id != idOfInsured })

                this.dataOfTheInsured = noEditingInsured

                this.dataOfTheInsured.push(editingInsured[0])

                this.saveTheDataOfInsured()


            }


        } else {
            /** inputy */

            const placeOfStay = document.getElementById(`place-of-stay`)
            const sumInsured = document.getElementById(`sum-insured`)
            let actualDate = this.returnCurrentTime()
            let validityFromDate = this.returnDateFrom()
            let validityToDate = this.returnDateTo()


            const validityFrom = document.getElementById(`validity-from`).value.toString()
            const validityTo = document.getElementById(`validity-to`).value.toString()

            document.getElementById("place-of-stay-error").innerHTML = ""
            document.getElementById("sum-insured-error").innerHTML = ""
            document.getElementById("validity-from-error").innerHTML = ""
            document.getElementById("validity-to-error").innerHTML = ""
            if (!placeOfStay.value.trim() || !sumInsured.value.trim() || !(/^[0-9\s]*$/).test(sumInsured.value) || !(validityFromDate >= actualDate) || !validityFrom || !(validityToDate > validityFromDate) || !validityTo) {
                if (placeOfStay.value.trim()) {

                } else {
                    valdidate("place-of-stay-error", "Vyplňte místo pobytu!", "place-of-stay")
                }

                if (sumInsured.value.trim() && (/^[0-9\s]*$/).test(sumInsured.value)) {

                } else if (!sumInsured.value.trim()) {
                    valdidate("sum-insured-error", "Vyplňte pojistnou částku!", "sum-insured")
                } else {
                    valdidate("sum-insured-error", "Vyplňte pouze čísla!", "sum-insured")
                }

                if (validityFromDate >= actualDate && validityFrom) {

                } else if (validityFromDate <= actualDate) {
                    valdidate("validity-from-error", "Začátek musí být větší nebo rovno dnešnímu datu!", "validity-from")

                } else {
                    valdidate("validity-from-error", "Vyplňte začátek platnosti pojištění!", "validity-from")
                }

                if (validityToDate > validityFromDate && validityTo) {

                } else if (validityToDate <= validityFromDate) {
                    valdidate("validity-to-error", "Konec platnosti musí být větší než začátek!", "validity-to")
                } else {
                    valdidate("validity-to-error", "Vyplňte konec platnosti pojištění!", "validity-to")

                }
            } else {

                const cestovniPojisteni = new CestovniPojisteni(sumInsured.value, validityFrom, validityTo, placeOfStay.value, travelInsurance, idOfInsurance)

                const editingInsured = this.dataOfTheInsured.filter(element => { return element.id == idOfInsured })

                for (let i = 0; i < editingInsured[0].dataOfInsurance.length; i++) {


                    if (Object.keys(editingInsured[0].dataOfInsurance[i]).toString() === "travelInsurance") {
                        if (editingInsured[0].dataOfInsurance[i].travelInsurance.id == idOfInsurance) {
                            editingInsured[0].dataOfInsurance.splice(i, 1)
                            break
                        }
                    }
                }

                editingInsured[0].dataOfInsurance.push(cestovniPojisteni)

                const noEditingInsured = this.dataOfTheInsured.filter(element => { return element.id != idOfInsured })

                this.dataOfTheInsured = noEditingInsured
                this.dataOfTheInsured.push(editingInsured[0])

                this.saveTheDataOfInsured()
            }
        }
    }

    deleteInsured(button) {
        /** Loading an id of the deleting record  */
        const id = button.parentElement.parentElement.childNodes[4].id

        /** Record filtering - keeps all records that do not have the same id as the id of the element being removed */
        this.dataOfTheInsured = this.dataOfTheInsured.filter(element => { return element.id != id })
        this.tableOfInsured.lastChild.innerHTML = ""
        localStorage.clear()
        this.saveTheDataOfInsured()
        this.listTheInsured()
    }

    sortInsured() {
        let data = this.dataOfTheInsured

        data.sort(compare)

        function compare(a, b) {
            if (a.name > b.name) {
                return 1
            }
            if (a.name < b.name) {
                return -1
            }
            return 0
        }
    }

    showDetail(button, selectedRow) {

        const id = button.parentElement.parentElement.childNodes[4].id

        const showDetailOfInsured = this.dataOfTheInsured.filter(element => { return element.id == id })

        let arrayOfInsured = showDetailOfInsured[0]

        let arrayOfInsurance = showDetailOfInsured[0].dataOfInsurance

        if (!arrayOfInsurance[0]) {
            const divWithDetailTable = document.createElement("div")
            divWithDetailTable.setAttribute("id", "div-with-detail-table")
            const tableWithDetail = document.createElement("table")
            tableWithDetail.setAttribute("class", "detail-of-insured")
            const tableHead = document.createElement("thead")
            tableHead.setAttribute("class", "detail-of-insured")
            tableHead.innerHTML =
                `
            <tr class = "detail-of-insured">
                                <th>
                                    Žádná sjednaná pojištění.
                                </th>                   
            </tr>
            `

            divWithDetailTable.appendChild(tableWithDetail)
            selectedRow.appendChild(divWithDetailTable)
            tableWithDetail.appendChild(tableHead)
            const phoneAndEmail = document.createElement("table")
            phoneAndEmail.setAttribute("class", "detail-of-insured")
            phoneAndEmail.innerHTML =
                `
            <thead class = "detail-of-insured">
                <tr class = "detail-of-insured">
                    <th>Mobil</th>
                    <th>Email</th>
                </tr>   
            </thead>

            <tbody class = "detail-of-insured">
                <tr class = "detail-of-insured">
                    <td>
                        ${arrayOfInsured.phone}
                    </td>
                    <td>
                        ${arrayOfInsured.email}
                    </td>
                </tr>
            </tbody>
            `
            tableWithDetail.insertAdjacentElement("afterend", phoneAndEmail)
        } else {
            const divWithDetailTable = document.createElement("div")
            divWithDetailTable.setAttribute("id", "div-with-detail-table")
            const tableWithDetail = document.createElement("table")
            tableWithDetail.setAttribute("class", "detail-of-insured")
            const tableHead = document.createElement("thead")
            tableHead.setAttribute("class", "detail-of-insured")
            tableHead.innerHTML =
                `
            <tr class = "detail-of-insured">
                                <th>
                                    Sjednaná pojištění
                                </th>
                                <th>
                                    <!-- ${showDetailOfInsured[0].dataOfInsurance.travelInsurance ? "Místo pobytu" : "Předmět pojištění"} -->

                                    Předmět pojištění/Místo pobytu
                                </th>
                                <th>
                                    Pojistná částka
                                </th>
                                <th>
                                    Platnost od
                                </th>
                                <th>
                                    Platnost do
                                </th>                              
            </tr>
            `
            divWithDetailTable.appendChild(tableWithDetail)
            selectedRow.appendChild(divWithDetailTable)
            tableWithDetail.appendChild(tableHead)

            const tableBody = document.createElement("tbody")
            tableBody.setAttribute("class", "detail-of-insured")

            tableWithDetail.appendChild(tableBody)

            for (let i = 0; i <= arrayOfInsurance.length - 1; i++) {
                const tableRow = document.createElement("tr")
                tableRow.setAttribute("class", "detail-of-insured")
                if (arrayOfInsurance[i].travelInsurance) {

                    tableRow.innerHTML =
                        `
                            <td>
                                ${arrayOfInsurance[i].travelInsurance.typeOfInsurance}
                            </td>
                            <td>
                                ${arrayOfInsurance[i].travelInsurance.placeOfStay}
                            </td>
                            <td>
                                ${arrayOfInsurance[i].travelInsurance.sumInsured}
                            </td>
                            <td>
                                ${arrayOfInsurance[i].travelInsurance.validFrom}
                            </td>
                            <td>
                                ${arrayOfInsurance[i].travelInsurance.validTo}
                            </td>
                       
                `
                    tableBody.insertAdjacentElement("beforeend", tableRow)

                } else {
                    const tableRow = document.createElement("tr")
                    tableRow.setAttribute("class", "detail-of-insured")
                    tableRow.innerHTML =
                        `
                            <td>
                                ${arrayOfInsurance[i].propertyInsurance.typeOfInsurance}
                            </td>
                            <td>
                                ${arrayOfInsurance[i].propertyInsurance.subjectOfInsurace}
                            </td>
                            <td>
                                ${arrayOfInsurance[i].propertyInsurance.sumInsured}
                            </td>
                            <td>
                                ${arrayOfInsurance[i].propertyInsurance.validFrom}
                            </td>
                            <td>
                                ${arrayOfInsurance[i].propertyInsurance.validTo}
                            </td>
                        
                `
                    tableBody.insertAdjacentElement("beforeend", tableRow)
                }
            }

            const phoneAndEmail = document.createElement("table")
            phoneAndEmail.setAttribute("class", "detail-of-insured")
            phoneAndEmail.innerHTML =
                `
            <thead class = "detail-of-insured">
                <tr class = "detail-of-insured">
                    <th>Mobil</th>
                    <th>Email</th>
                </tr>   
            </thead>

            <tbody class = "detail-of-insured">
                <tr class = "detail-of-insured">
                    <td>
                        ${arrayOfInsured.phone}
                    </td>
                    <td>
                        ${arrayOfInsured.email}
                    </td>
                </tr>
            </tbody>
            `
            tableWithDetail.insertAdjacentElement("afterend", phoneAndEmail)
        }
    }

    editInsured(button, selectedRow) {

        let id = button.parentElement.parentElement.childNodes[4].id
        const editingInsured = this.dataOfTheInsured.filter(element => { return element.id == id })

        const arrayOfInsuranceWithOutNull = editingInsured[0].dataOfInsurance.filter(element => {
            return element !== null
        })

        editingInsured[0].dataOfInsurance = []
        editingInsured[0].dataOfInsurance = arrayOfInsuranceWithOutNull

        const editing = document.createElement("div")
        editing.setAttribute("id", "editing")


        const editInsured = document.createElement("div")
        editInsured.setAttribute("id", "edit-insured")
        editInsured.innerHTML =
            `
        <h2>Editace Pojištěnce</h2>
        <p>Jméno</p>
        <span id="name-error"></span>
        <input type="text" name= "first-name" placeholder="Jan" id="first-name${id}" class="input">
        <p>Příjmení</p>
        <span id="second-name-error"></span>
        <input type="text" name= "second-name" placeholder="Novák" id="second-name${id}" class="input">
        <p>Email</p>
        <span id="email-error"></span>
        <input type="text" name= "email" placeholder="jan.novak@email.cz" id="email${id}" class="input">
        <p>Telefon</p>
        <span id="phone-error"></span>
        <input type="text" name= "phone" placeholder="777666555" id="phone-number${id}" class="input">
        <p>Ulice a číslo popisné</p>
        <span id="street-house-number-error"></span>
        <input type="text" name= "street" placeholder="Ulice 1" id="street-house-number${id}" class="input">
        <p>Město</p>
        <span id="city-error"></span>
        <input type="text" name= "city" placeholder="Praha 1" id="city${id}" class="input">
        <p>PSČ</p>
        <span id="postal-code-error"></span>
        <input type="text" name= "postal-code" placeholder="10000" id="postal-code${id}" class="input">
        `
        editing.appendChild(editInsured)
        selectedRow.appendChild(editing)

        const editInsurance = document.createElement("div")
        editInsurance.setAttribute("id", "add-insurance")

        const confirmButtonDiv = document.createElement("div")
        confirmButtonDiv.setAttribute("id", "confirm-button-div")
        confirmButtonDiv.innerHTML =
            `<button type="submit" id="confirm-button" class= "confirm">Uložit</button>`
        editInsured.appendChild(confirmButtonDiv)
        const confirmButton = document.getElementById(`confirm-button`)

        const name = document.getElementById(`first-name${id}`)
        const secondName = document.getElementById(`second-name${id}`)
        const email = document.getElementById(`email${id}`)
        const phone = document.getElementById(`phone-number${id}`)
        const street = document.getElementById(`street-house-number${id}`)
        const city = document.getElementById(`city${id}`)
        const postalCode = document.getElementById(`postal-code${id}`)

        this.validateInsured(confirmButton, name, secondName, email, phone, street, city, postalCode, id)

        const editInsuranceDiv = document.createElement("div")
        editInsuranceDiv.setAttribute("id", "edit-insurance")

        const head = document.createElement("h2")
        head.innerHTML = "Editace pojištěnce"
        editInsuranceDiv.appendChild(head)
        const editInsuranceTable = document.createElement("table")
        editInsuranceTable.setAttribute("id", `edit-table${id}`)
        editInsuranceTable.setAttribute("class", `edit-table`)
        const editInsuranceTableHead = document.createElement("thead")

        editing.appendChild(editInsuranceTable)

        editInsuranceTableHead.innerHTML =
            `
                <tr>
                                    <th>
                                        Sjednaná pojištění
                                    </th>
                                    <th>
                                        Předmět pojištění/Místo pobytu
                                    </th>
                                    <th>
                                        ID pojištění
                                    </th>
                                    <th>
                                        
                                    </th>
                </tr>
                `


        editing.appendChild(editInsuranceDiv)
        editInsuranceDiv.appendChild(editInsuranceTable)
        editInsuranceTable.appendChild(editInsuranceTableHead)

        editInsurance.innerHTML =
            `
        <h2>Přidat pojištění</h2>

        <select name="insurance" id="select-insurance">

            <option value="choose-option">---Zvolte jednu z možností---</option>
            <option value="property-insurance" id="property-insurance">Pojištění majetku</option>
            <option value="travel-insurance" id="travel-insurance">Cestovní pojištění</option>

        </select>
            <button id= "add-insurance-button${id}" class = "add-insurance-button">Uložit</button>
        `

        editInsuranceDiv.appendChild(editInsurance)

        let confirmInsuranceButton = document.getElementById(`add-insurance-button${id}`)

        const tableBody = document.createElement("tbody")
        tableBody.setAttribute("class", "edit-insurance")
        tableBody.setAttribute("id", `edit-insurance-tbody${id}`)

        this.addInsurance(confirmInsuranceButton, id)
        this.sortInsurance(id, editInsuranceTable, tableBody)

        let selectInsurance = document.getElementById("select-insurance")
        selectInsurance.addEventListener("change", () => {
            this.sortInsurance(id, editInsuranceTable, tableBody)
        })

        confirmInsuranceButton.addEventListener("click", () => {

            let selectInsurance = document.getElementById("select-insurance")

            this.sortInsurance(id, editInsuranceTable, tableBody)

            let subjectOfInsurace
            let placeOfStay
            let sumInsured
            let validityFrom
            let validityTo

            let subjectInsuranceError
            let placeOfStayError
            let sumInsuredError
            let valididtyToError
            let valididtyFromError



            if (selectInsurance.value === "property-insurance") {

                subjectOfInsurace = document.getElementById("subject-of-insurance")
                sumInsured = document.getElementById("sum-insured")
                validityFrom = document.getElementById("validity-from")
                validityTo = document.getElementById("validity-to")

                subjectInsuranceError = document.getElementById("subject-of-insurance-error")
                sumInsuredError = document.getElementById("sum-insured-error")
                valididtyFromError = document.getElementById("validity-from-error")
                valididtyToError = document.getElementById("validity-to-error")

                if (subjectOfInsurace.value && sumInsured.value && validityFrom.value && validityTo.value && !subjectInsuranceError.value && !sumInsuredError.value && !valididtyFromError.value && !valididtyToError.value) {
                    if (document.querySelector(".remove")) {
                        document.querySelector(".remove").remove()
                    }
                }
            } else {
                placeOfStay = document.getElementById("place-of-stay")
                sumInsured = document.getElementById("sum-insured")
                validityFrom = document.getElementById("validity-from")
                validityTo = document.getElementById("validity-to")

                placeOfStayError = document.getElementById("place-of-stay-error")
                sumInsuredError = document.getElementById("sum-insured-error")
                valididtyFromError = document.getElementById("validity-from-error")
                valididtyToError = document.getElementById("validity-to-error")

                if (placeOfStay.value && sumInsured.value && validityFrom.value && validityTo.value && !(placeOfStayError.value) && !(sumInsuredError.value) && !(valididtyFromError.value) && !(valididtyToError.value)) {
                    if (document.querySelector(".remove")) {
                        document.querySelector(".remove").remove()
                    }
                }
            }
        })

        document.getElementById(`first-name${id}`).value = editingInsured[0].name
        document.getElementById(`second-name${id}`).value = editingInsured[0].secondName
        document.getElementById(`email${id}`).value = editingInsured[0].email
        document.getElementById(`phone-number${id}`).value = editingInsured[0].phone
        document.getElementById(`street-house-number${id}`).value = editingInsured[0].street
        document.getElementById(`city${id}`).value = editingInsured[0].city
        document.getElementById(`postal-code${id}`).value = editingInsured[0].postalCode

    }

    sortInsurance(id, editInsuranceTable, tableBody) {

        tableBody.innerHTML = ""

        let idOfInsured = id

        //insu
        const editingInsured = this.dataOfTheInsured.filter(element => { return element.id == idOfInsured })

        //arrayWithOutNull
        const arrayOfInsuranceWithOutNull = editingInsured[0].dataOfInsurance.filter(element => {
            return element !== null
        })

        let arrayOfInsurance = editingInsured[0].dataOfInsurance

        editingInsured[0].dataOfInsurance = []
        editingInsured[0].dataOfInsurance = arrayOfInsuranceWithOutNull

        editInsuranceTable.appendChild(tableBody)

        for (let i = 0; i <= arrayOfInsurance.length - 1; i++) {
            const tableRow = document.createElement("tr")

            if (arrayOfInsurance[i].travelInsurance) {
                tableRow.setAttribute("id", `edit-insurance${arrayOfInsurance[i].travelInsurance.id}`)
                tableRow.innerHTML =
                    `
                    <td>
                        ${arrayOfInsurance[i].travelInsurance.typeOfInsurance}
                    </td>
                    <td>
                        ${arrayOfInsurance[i].travelInsurance.placeOfStay}
                    </td>
                    <td id = ${idOfInsured}>
                        ${arrayOfInsurance[i].travelInsurance.id}
                    </td>
                    <td>
                        <button id = "edit-button-in-edit${arrayOfInsurance[i].travelInsurance.id}" class = "edit-travel-button">Editovat</button>
                        <button id = "delete-travel-button${arrayOfInsurance[i].travelInsurance.id}" class = "delete-travel-button">Smazat</button>
                    </td>

        `
                tableBody.appendChild(tableRow)

                const deleteButtonInDelete = document.getElementById(`delete-travel-button${arrayOfInsurance[i].travelInsurance.id}`)
                const editButtonInEdit = document.getElementById(`edit-button-in-edit${arrayOfInsurance[i].travelInsurance.id}`)
                deleteButtonInDelete.addEventListener("click", () => {
                    this.deleteInsurance(deleteButtonInDelete)
                })

                editButtonInEdit.addEventListener("click", () => {
                    let selectedRow = editButtonInEdit.parentElement.parentElement

                    let idOfInsurance = selectedRow.childNodes[5].innerText

                    let body = document.querySelectorAll(".edit-insurance")[0]

                    if (editButtonInEdit.classList.contains("clicked-edit")) {
                        editButtonInEdit.classList.remove("clicked-edit")
                        selectedRow.removeChild(selectedRow.childNodes[9])
                    } else {
                        editButtonInEdit.classList.add("clicked-edit")
                        

                        for (let i = 0; i < body.childNodes.length; i++) {
                            if (idOfInsurance != body.childNodes[i].childNodes[5].innerText && body.childNodes[i].childNodes[9]) {

                                body.childNodes[i].childNodes[7].childNodes[1].classList.remove("clicked-edit")

                                body.childNodes[i].childNodes[9].remove()
                            }
                        }
                            this.editInsurance(editButtonInEdit, selectedRow)
                    }
                })

            } else {
                const tableRow = document.createElement("tr")
                tableRow.setAttribute("id", `edit-insurance${arrayOfInsurance[i].propertyInsurance.id}`)
                tableRow.innerHTML =
                    `
                    <td>
                        ${arrayOfInsurance[i].propertyInsurance.typeOfInsurance}
                    </td>
                    <td>
                        ${arrayOfInsurance[i].propertyInsurance.subjectOfInsurace}
                    </td>
                    <td>
                        ${arrayOfInsurance[i].propertyInsurance.id}
                    </td>
                    <td>
                        <button id = "edit-button-in-edit${arrayOfInsurance[i].propertyInsurance.id}" class = "edit-travel-button">Editovat</button>
                        <button id = "delete-property-button${arrayOfInsurance[i].propertyInsurance.id}" class = "delete-property-button">Smazat</button>
                    </td>
        `
                tableBody.insertAdjacentElement("beforeend", tableRow)

                const deleteButtonInDelete = document.getElementById(`delete-property-button${arrayOfInsurance[i].propertyInsurance.id}`)
                const editButtonInEdit = document.getElementById(`edit-button-in-edit${arrayOfInsurance[i].propertyInsurance.id}`)
                deleteButtonInDelete.addEventListener("click", () => {
                    this.deleteInsurance(deleteButtonInDelete)

                })

                editButtonInEdit.addEventListener("click", () => {

                    let selectedRow = editButtonInEdit.parentElement.parentElement
                    let idOfInsurance = selectedRow.childNodes[5].innerText

                    let body = document.querySelectorAll(".edit-insurance")[0]

                    if (editButtonInEdit.classList.contains("clicked-edit")) {
                        editButtonInEdit.classList.remove("clicked-edit")
                        selectedRow.removeChild(selectedRow.childNodes[9])
                    } else {
                        editButtonInEdit.classList.add("clicked-edit")
                        

                        for (let i = 0; i < body.childNodes.length; i++) {
                            if (idOfInsurance != body.childNodes[i].childNodes[5].innerText && body.childNodes[i].childNodes[9]) {

                                //remove class clicked-edit from edit button
                                body.childNodes[i].childNodes[7].childNodes[1].classList.remove("clicked-edit")
                                //remove editing div
                                body.childNodes[i].childNodes[9].remove()
                            }
                            
                        }
                        this.editInsurance(editButtonInEdit, selectedRow)
                    }
                })
            }
        }
    }
    addInsurance(confirmOrsubmitButton, idOfInsured) {
        const propertyElement = document.createElement("div")
        propertyElement.setAttribute("class", "remove")
        const travelElement = document.createElement("div")
        travelElement.setAttribute("class", "remove")

        propertyElement.innerHTML =
            `
        <div id="personal-data">
        <p>Předmět pojištění</p>
        <span id="subject-of-insurance-error"></span>
        <input type="text" placeholder="Např: Byt - vyplňte pokud chcete pojistit majetek." id="subject-of-insurance">
        <p>Pojistná částka</p>
        <span id="sum-insured-error"></span>
        <input type="text" placeholder="Např: 2 500 000" id="sum-insured">
        <p>Platnost od</p>
        <span id="validity-from-error"></span>
        <input type="text" placeholder="Datum ve formátu: DD.MM.RRRR" id="validity-from">
        <p>Platnost do</p><span id="validity-to-error"></span>
        <input type="text" placeholder="Datum ve formátu: DD.MM.RRRR" id="validity-to">
        </div>
        `
        travelElement.innerHTML =
            `
        <div id="personal-data">
        <p>Místo pobytu</p>
        <span id="place-of-stay-error"></span>
        <input type="text" placeholder="Např: USA - vyplňte pokud chcete cestovní pojištění." id="place-of-stay">
        <p>Pojistná částka</p>
        <span id="sum-insured-error"></span>
        <input type="text" placeholder="Např: 2 500 000" id="sum-insured">
        <p>Platnost od</p>
        <span id="validity-from-error"></span>
        <input type="text" placeholder="Datum ve formátu: DD.MM.RRRR" id="validity-from">
        <p>Platnost do</p>
        <span id="validity-to-error"></span>
        <input type="text" placeholder="Datum ve formátu: DD.MM.RRRR" id="validity-to">
        </div>
        `

        let selectInsurance = document.querySelector('[name="insurance"]')
        let propertyInsurance = "Pojištění majetku"
        let travelInsurance = "Cestovní pojištění"
        let selected


        selectInsurance.addEventListener('change', (event) => {
            selected = event.target.value
            let odstran = document.querySelector(".remove")

            if (odstran) {
                odstran.remove()
            }

            if (selected == "property-insurance") {
                selectInsurance.insertAdjacentElement("afterend", propertyElement)
            } else if (selected == "travel-insurance") {
                selectInsurance.insertAdjacentElement("afterend", travelElement)
            }
        })

        confirmOrsubmitButton.addEventListener("click", () => {
            function valdidate(idOfInput, errorValue, invalidInput) {
                let invalidElement = document.getElementById(invalidInput)
                invalidElement.style.border = "thin solid red"
                let nameError = document.getElementById(idOfInput)
                nameError.innerHTML = ""
                let error = document.createElement("p")
                error.style.color = "red"
                error.innerHTML = new Error(errorValue)
                nameError.insertAdjacentElement("afterbegin", error)
                return
            }

            if (selectInsurance.value == "property-insurance" || selectInsurance.value == "travel-insurance") {
                if (selectInsurance.value == "property-insurance") {
                    /** inputy */

                    const subjectOfInsurance = document.getElementById("subject-of-insurance")
                    const sumInsured = document.getElementById("sum-insured")
                    let actualDate = this.returnCurrentTime()
                    let validityFromDate = this.returnDateFrom()
                    let validityToDate = this.returnDateTo()

                    const validityFrom = document.getElementById("validity-from").value.toString()
                    const validityTo = document.getElementById("validity-to").value.toString()

                    document.getElementById("subject-of-insurance-error").innerHTML = ""
                    document.getElementById("sum-insured-error").innerHTML = ""
                    document.getElementById("validity-from-error").innerHTML = ""
                    document.getElementById("validity-to-error").innerHTML = ""

                    if (!subjectOfInsurance.value.trim() || !sumInsured.value.trim() || !(/^[0-9\s]*$/).test(sumInsured.value) || !(validityFromDate >= actualDate) || !validityFrom || !(validityToDate > validityFromDate) || !validityTo) {
                        if (subjectOfInsurance.value.trim()) {

                        } else {
                            valdidate("subject-of-insurance-error", "Vyplňte předmět pojištění!", "subject-of-insurance")
                        }

                        if (sumInsured.value.trim() && (/^[0-9\s]*$/).test(sumInsured.value)) {

                        } else if (!sumInsured.value.trim()) {
                            valdidate("sum-insured-error", "Vyplňte pojistnou částku!", "sum-insured")
                        } else {
                            valdidate("sum-insured-error", "Vyplňte pouze čísla!", "sum-insured")
                        }

                        if (validityFromDate >= actualDate && validityFrom) {

                        } else if (validityFromDate <= actualDate) {
                            valdidate("validity-from-error", "Začátek musí být větší nebo rovno dnešnímu datu!", "validity-from")

                        } else {
                            valdidate("validity-from-error", "Vyplňte začátek platnosti pojištění!", "validity-from")
                        }

                        if (validityToDate > validityFromDate && validityTo) {

                        } else if (validityToDate <= validityFromDate) {
                            valdidate("validity-to-error", "Konec platnosti musí být větší než začátek!", "validity-to")
                        } else {
                            valdidate("validity-to-error", "Vyplňte konec platnosti pojištění!", "validity-to")
                        }
                    } else {

                        if (window.location.pathname == "/seznamPojistencu.html") {


                            const pojisteniMajetku = new PojisteniMajetku(sumInsured.value, validityFrom, validityTo, subjectOfInsurance.value, propertyInsurance, (Math.ceil(Math.random() * 1000000)))

                            const editingInsured = this.dataOfTheInsured.filter(element => { return element.id == idOfInsured })

                            editingInsured[0].dataOfInsurance.push(pojisteniMajetku)

                            const noEditingInsured = this.dataOfTheInsured.filter(element => { return element.id != idOfInsured })

                            this.dataOfTheInsured = noEditingInsured
                            this.dataOfTheInsured.push(editingInsured[0])
                            this.saveTheDataOfInsured()

                        } else {

                            const pojisteniMajetku = new PojisteniMajetku(sumInsured.value, validityFrom, validityTo, subjectOfInsurance.value, propertyInsurance, (Math.ceil(Math.random() * 1000000)))

                            this.addInsuranceToInsured(pojisteniMajetku)
                            window.location.href = "seznamPojistencu.html"
                        }
                    }

                } else if (selectInsurance.value == "travel-insurance") {

                    /** inputy */

                    const placeOfStay = document.getElementById("place-of-stay")
                    const sumInsured = document.getElementById("sum-insured")
                    let actualDate = this.returnCurrentTime()
                    let validityFromDate = this.returnDateFrom()
                    let validityToDate = this.returnDateTo()

                    const validityFrom = document.getElementById("validity-from").value.toString()
                    const validityTo = document.getElementById("validity-to").value.toString()

                    document.getElementById("place-of-stay-error").innerHTML = ""
                    document.getElementById("sum-insured-error").innerHTML = ""
                    document.getElementById("validity-from-error").innerHTML = ""
                    document.getElementById("validity-to-error").innerHTML = ""
                    if (!placeOfStay.value.trim() || !sumInsured.value.trim() || !(/^[0-9\s]*$/).test(sumInsured.value) || !(validityFromDate >= actualDate) || !validityFrom || !(validityToDate > validityFromDate) || !validityTo) {
                        if (placeOfStay.value.trim()) {

                        } else {
                            valdidate("place-of-stay-error", "Vyplňte místo pobytu!", "place-of-stay")
                        }

                        if (sumInsured.value.trim() && (/^[0-9\s]*$/).test(sumInsured.value)) {

                        } else if (!sumInsured.value.trim()) {
                            valdidate("sum-insured-error", "Vyplňte pojistnou částku!", "sum-insured")
                        } else {
                            valdidate("sum-insured-error", "Vyplňte pouze čísla!", "sum-insured")
                        }

                        if (validityFromDate >= actualDate && validityFrom) {

                        } else if (validityFromDate <= actualDate) {
                            valdidate("validity-from-error", "Začátek musí být větší nebo rovno dnešnímu datu!", "validity-from")

                        } else {
                            valdidate("validity-from-error", "Vyplňte začátek platnosti pojištění!", "validity-from")
                        }

                        if (validityToDate > validityFromDate && validityTo) {

                        } else if (validityToDate <= validityFromDate) {
                            valdidate("validity-to-error", "Konec platnosti musí být větší než začátek!", "validity-to")
                        } else {
                            valdidate("validity-to-error", "Vyplňte konec platnosti pojištění!", "validity-to")
                        }
                    } else {
                        if (window.location.pathname == "/seznamPojistencu.html") {

                            const cestovniPojisteni = new CestovniPojisteni(sumInsured.value, validityFrom, validityTo, placeOfStay.value, travelInsurance, (Math.ceil(Math.random() * 1000000)))

                            const editingInsured = this.dataOfTheInsured.filter(element => { return element.id == idOfInsured })

                            editingInsured[0].dataOfInsurance.push(cestovniPojisteni)

                            const noEditingInsured = this.dataOfTheInsured.filter(element => { return element.id != idOfInsured })

                            this.dataOfTheInsured = noEditingInsured
                            this.dataOfTheInsured.push(editingInsured[0])

                            this.saveTheDataOfInsured()

                        } else {
                            const cestovniPojisteni = new CestovniPojisteni(sumInsured.value, validityFrom, validityTo, placeOfStay.value, travelInsurance, (Math.ceil(Math.random() * 1000000)))



                            this.addInsuranceToInsured(cestovniPojisteni)
                            window.location.href = "seznamPojistencu.html"
                        }
                    }
                }
            } else {
                valdidate("insurance-error", "Vyber jednu z možností!", "select-insurance")
            }
        })
    }

    returnCurrentTime() {
        let today = new Date()
        let ddd = today.getDate()
        let mmm = today.getMonth()
        let yyyyy = today.getFullYear()

        return new Date(yyyyy, mmm, ddd)
    }

    returnDateFrom() {
        const validityFrom = document.getElementById(`validity-from`).value.toString()

        let validityFromSplit = validityFrom.split(".")
        let dd = parseInt(validityFromSplit[0])
        let mm = parseInt(validityFromSplit[1]) - 1
        let yyyy = parseInt(validityFromSplit[2])

        return new Date(yyyy, mm, dd)

    }

    returnDateTo() {
        const validityTo = document.getElementById(`validity-to`).value.toString()

        let validityToSplit = validityTo.split(".")
        let d = parseInt(validityToSplit[0])
        let m = parseInt(validityToSplit[1]) - 1
        let y = parseInt(validityToSplit[2])

        return new Date(y, m, d)
    }
}
