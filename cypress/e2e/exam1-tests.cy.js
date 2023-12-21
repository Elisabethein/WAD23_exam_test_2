/// <reference types = "cypress"/>  

it('Test 1', () => {
    // Step 1: Visit the Courses page
    cy.visit('http://localhost:8080/');
  
    // Step 2: Check if it has an 'h3' element that contains 'Courses'
    cy.get('h3').contains('Courses');
  
    // Step 3: Locate the first link inside the table and click it
    cy.get('.container table tr.item td:nth-child(3) a').first().invoke('text').as('clickedSemester');
    cy.get('.container table tr.item td:nth-child(3) a').first().click();
    cy.get('@clickedSemester').then((clickedSemester) => {
      // Step 4: Check if the page is redirected to Semester.vue
      cy.url().should('include', `${clickedSemester}`);
  
      // Step 5: Check if the 'h3' in SemesterView contains the selected semester
      cy.get('h3').contains(`${clickedSemester}`);
  });
});

it('Test 2', () => {
  cy.visit('http://localhost:8080/');
  cy.get('.container table tr.item td:nth-child(1)').first().click();
  cy.get('#note').clear().type('Test note');
  cy.get('.addNote').first().click();
  cy.get('.description').should('be.visible');
  cy.get('.allNotes').should('not.be.empty');
});
/*
it('Test 3', () => {
  cy.visit('http://localhost:8080/');
  cy.get('#codeAdd').clear().type('69');
  cy.get('#titleAdd').clear().type('Testing');
  cy.get('#semesterAdd').clear().type('fall');
  cy.get('#creditsAdd').clear().type(69);
  cy.get('#descriptionAdd').clear().type('Testing again');
  cy.get('.add').click();
});*/

it('Test API', () => {
  cy.request('POST', 'http://localhost:3000/api/courses', {
            "code": "42",
            "title": "Testing API",
            "semester": "spring",
            "credits": 42,
            "description": "testing API"
        })
        .then((res) => {
            cy.log(res.body)
            let post = res.body.rows['0'].id
            expect(post).to.not.be.null;
            cy.log('a course is added')
            cy.request('DELETE', `http://localhost:3000/api/courses/${post}`)
            .then((deleteRes) => {
              expect(deleteRes.status).to.equal(200);
              cy.log('The added course is deleted');
            });
        });
});
