
var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var assert = require('assert');


const testingFunctions = require("../JS/Functions/createFunctions.js");

console.log(testingFunctions);


var para = "This is a random description thingie";


describe("Data Validation", function(){


     beforeEach(function() {
          alert = sinon.spy();
        });


    describe("When testing validTitle", function(){




        it("creates alert() and return false with no string given", function(){

            testingFunctions.validTitle();
            expect(alert.calledOnce).to.be.true;


        });

        it("creates alert() and return false with '' ", function(){

            testingFunctions.validTitle('');
            expect(alert.calledOnce).to.be.true;

        });

         it("creates alert() and return false with string of over 40 characters ", function(){

             testingFunctions.validTitle('ENIAotxofo7sYOgu5wMYcu6J9hQwdmUClccFSh0qF');
             expect(alert.calledOnce).to.be.true;

         });

        it("works with 'This is the title' given", function(){
            assert.equal(testingFunctions.validTitle('This is the title'),true);

        });



    })


    describe("When testing validDesc", function(){




        it("creates alert() and return false with no string given", function(){

            testingFunctions.validDesc();
            expect(alert.calledOnce).to.be.true;


        });

        it("creates alert() and return false with '' ", function(){

            testingFunctions.validDesc('');
            expect(alert.calledOnce).to.be.true;

        });

         it("creates alert() and return false with string of over 300 characters ", function(){

             testingFunctions.validDesc('cy7WgJU8DqI9VEeel2Fd6Cn9KttMYBfj2CH9GGbPeHFoB8KnX401xsZTBImcoR7Fm1IajuWRUS9JRCAyt96Q6zBk7LGTRW9FuOjFIKalYeFb9hW7SQCBbJWl3I23BDIEALssjnFgDrNJm1x6uJr16fAB3f7GW4cyeKuJuo2rOiz25JXLuwdlXVrOVMBDnBieMjkXMxAZDYfCOGoZa7vh2KcdrCSIqDARWOsPRlTtE3FBlUfJF2479PZXPjYhKAIhBrXWrdZcu2BFeVLwE7Wtltw4FjvXqxNgsRJrvuNCi0GoL');
             expect(alert.calledOnce).to.be.true;

         });


        it("works with 'This is the super long and obnoxious description of what you need to do' given", function(){
            assert.equal(testingFunctions.validDesc('This is the title'),true);

        });



    })

    describe("When testing validTask", function(){




        it("creates alert() and return false with no string given", function(){

            testingFunctions.validTask();
            expect(alert.calledOnce).to.be.true;


        });

        it("creates alert() and return false with '' ", function(){

            testingFunctions.validTask('');
            expect(alert.calledOnce).to.be.true;

        });

         it("creates alert() and return false with string of over 200 characters ", function(){

             testingFunctions.validTask('XCixmrnlZ3kVbtqYjThE4v3ORf0bxkHYmAVxTm7QkhBbqqa6XLLrUVaCSvgjnwHoZ2GvLM8aDD431tuMs2gwt37dI3fPb727o3WCU0L7jFc3UX57xDTBV9HaKErjAuUwzvXZg0OcpLGykLEXFPuak4Nm7lbDHI1x0UTaeLByymN1IkeTqwZRTCF58gPD681UMpwyWZu70');
             expect(alert.calledOnce).to.be.true;

         });

        it("works with 'This is the task title' given", function(){
            assert.equal(testingFunctions.validTask('This is the title'),true);

        });



    })

    describe("When testing validHint", function(){




        it("creates alert() and return false with no string given", function(){

            testingFunctions.validHint();
            expect(alert.calledOnce).to.be.true;


        });

        it("creates alert() and return false with '' ", function(){

            testingFunctions.validHint('');
            expect(alert.calledOnce).to.be.true;

        });

         it("creates alert() and return false with string of over 45 characters ", function(){

             testingFunctions.validHint('HgWOyqn6J9HCpyxYReBNpcdEtCI9A0CC4vNJQSc5boCb1j');
             expect(alert.calledOnce).to.be.true;

         });

        it("works with 'This is the hint' given", function(){
            assert.equal(testingFunctions.validHint('This is the title'),true);

        });



    })



    describe("When testing validTextAnswer", function(){




        it("creates alert() and return false with no string given", function(){

            testingFunctions.validTextAnswer();
            expect(alert.calledOnce).to.be.true;


        });

        it("creates alert() and return false with '' ", function(){

            testingFunctions.validTextAnswer('');
            expect(alert.calledOnce).to.be.true;

        });

         it("creates alert() and return false with string of over 121 characters ", function(){

             testingFunctions.validTextAnswer('krQvDdQNSNWR40omqMRSxggNo4mKXrItweiUsXrZmGL3oYo9GCial2zLTMN8wZCORq5qAfv0pu1rbzkqWQH6BN2DTh0TfRYOYVw5RTsWEb5urtp34dIvYETwb');
             expect(alert.calledOnce).to.be.true;

         });

        it("works with 'This is the hint' given", function(){
            assert.equal(testingFunctions.validTextAnswer('This is the title'),true);

        });



    })

    describe("When testing validHours", function(){





        it("creates alert() and return false with number less than 0 ", function(){

            testingFunctions.validHours(-3);
            expect(alert.calledOnce).to.be.true;

        });

         it("creates alert() and return false with number over 24 ", function(){

             testingFunctions.validHours(26);
             expect(alert.calledOnce).to.be.true;

         });

        it("works with number given", function(){
            assert.equal(testingFunctions.validHours(8),true);

        });


        it("works with no parameters given (optional argument for user)", function(){

            assert.equal(testingFunctions.validHours(),true);


        });



    })

})





//function generateAlert(x) {
//  if (!x) {
//    return;
//  }
//
//  alert(x);
//}
//
//describe('AlertView', function() {
//  beforeEach(function() {
//    alert = sinon.spy();
//  });
//
//  it('should create an alert only when x is true', function() {
//    generateAlert(true);
//
//    expect(alert.calledOnce).to.be.true;
//    expect(alert.args[0][0]).to.equal(true);
//  });
//
//  });




//})


//describe("Data Validation", function() {
////
////    it('should return -1 when the value is not present', function() {
////      assert.should
////    });
////
//
//}
//
//
