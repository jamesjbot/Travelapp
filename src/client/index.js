
/* jshint esversion:6 */

import { addUserInputCard, replaceWithInfoCard} from './js/buttonpress';

import './styles/style.scss';

// Attach EventListener to button
const legbutton = document.getElementById('addTravelLegButton');
legbutton.addEventListener("click", addUserInputCard);

addUserInputCard();

function removeInformationCard(element) {
  let travelCard = element.parentElement.parentElement.parentElement;
  if (travelCard.classList.contains('travel_card')) {
    travelCard.remove();
  } else {
    throw error('You are removing the wrong element please check your parent element div nesting');
  }
}

// Exported functions that can be used on the webpage with Client. syntax
export { replaceWithInfoCard,  removeInformationCard };
