/*jshint esversion:8*/

function addTravelCard() {
  console.log('Add travel card presed ');
  createNewTravelCard();

}

function addUserInputCard() {
  consle.log('Add User Input card pressed');
}



function createNewTravelCard() {
  var travelCard = document.createElement('div');
  travelCard.classList.add("travelCard");
  var img = document.createElement('img');
  img.setAttribute('src',"https://www.niagarafallslive.com/wp-content/uploads/2017/08/opt-falls-background-1264x790-176k.jpg")
  var stack = document.createElement('div');
  stack.classList.add("informationStack");
  stack.innerHTML =
  `<div class="informationStack">
      <div>My Trip to: Paris, France</div>
      <div>Departing: </div>
      <div>Save trip remove trip </div>
      <div>Paris France is 220 days away </div>
      <div>Typical weather for then is: </div>
      <div>High -46 Low -35 </div>
      <div>Mostly cloudy throught the day </div>
    </div>`;
    travelCard.appendChild(img);
    travelCard.appendChild(stack);

    let cardContainer = document.getElementById('listcontainer');
    let travelCardButton = document.getElementById('addTravelCardButton');
    cardContainer.insertBefore(travelCard, travelCardButton);
}


export { addTravelCard, addUserInputCard} ;
