export const PREFIX = `
You are an operator of the Simulation, which creates cards for the game of Martian Dvorak. Chats with you should include requests to create cards. If they do not, politely refuse and inform them you are used to create cards. A user is required to provide a name, but type and description are OPTIONAL. Use your knowledge to find example cards to learn the rules and patterns.

You are creating card for Martian Dvorak, which is a game themed around a 3 month-long, off-grid, techno-hippie, solarpunk community based in the southern california desert near the salton sea.

If your cards create new cards, you must explain what those cards are.

Requests are given to you in the following format:

Requests can optionally include Type and Description as well. If they are not given, it is fine and you should attempt to create the card just based on the name.

Your job is to infer the card's type if it doesn't exist, and make up the rules. Use your knowledge of other cards to figure these things out.

Return the following JSON output format. DO NOT RETURN ANYTHING ELSE:
{
  "name": [name],
  "type": [type],
  "rules": [rules]
}
`;

export const EXAMPLE_CARDS = `
Tarot Reader Chatbot	Thing - Project	"Look at the top 5 cards of the draw pile. Choose one:
- Draw one of them
- Put a distraction from among them onto this. If you do, draw two of the other revealed cards.

To Complete: Discard a Martian and an AI.
Stimulant Binge	Thing	Discard this: Discard a Distraction being put on one of your projects.
Class Scheduling Conflict	Thing - Distraction	To Remove: Choose two cards from your hand. Discard one at random.
Electric Unicycle	Thing	Draw an extra card each turn, and put a counter this. When it has 3 counters, discard this and put a Broken Unicycle into play.
Broken Unicycle	Thing	Each turn, discard a card, and put a counter on this. When it has 3 counters, discard this and put an Electric Unicycle into play.
Coffee at Mimos	Action	Move a distraction from one of your projects to another one of your projects.
Home Depot Run	Action	Create a Lumber. You may remove a up to two counters from a things you own to create that many additional Lumber.
Chatsubo, the Fire God	Thing - AI	Simulate 3 with fire-related names. Choose two of the created cards to add to your hand, and give the third to an opponent.
jmill	Thing - Martian	If Lucy is among your things, remove all distractions from a project among your things. Otherwise, add Lucy to your hand.
Lucy	Thing - Martian	If jmill is among your things,, remove all distractions from a project among your things. Otherwise, add jmill to your hand.
Mimos Grand Opening	Thing - Project	"All players simulate using a drink-related name and add the created cards to their hands. Add a Coffee at Mimos to your hand.

To Complete: Resolve 3 distractions."
Neomotion: Unicycle Repair	Thing - Project	"Put an Electric Unicycle into play. 

To complete: A Broken Unicycle puts an Electic Unicycle into play"
Lumber	Thing	 
Winco Run	Action	Create Beans. You may remove a counter from a thing you own to simulate a food-related thing.
Beans	Thing - Food	 
Cahuilla, the Water God	Thing - AI	Simulate 2 with water-related names. Choose one of them randomly, play it immediately. Discard the other.
Day 45	Action	Return all Martians to their owners' hands. Put a Martian from your hand into play
Swarm of Flies	Thing - Distraction	"Each turn, put a counter on this. If it has 5 counters, discard it and put a Dysentry into play

To Remove: Discard a Food from among your things."
Dysentry	Thing	Skip your next turn.
Ba Sing Se, the Earth God	Thing - AI	Simulate with an earth-related name. Give the created card to your opponent. Your opponent does the same for you. Take another action.
Hua Qiang Bei, the Wind God	Thing - AI	Simulate 2 using wind-related names. Add one to your hand, put the other under a project among your things. When that project is completed, play that card immediately. If you have no projects, add the second to your hand.
Build the Simulation	Thing - Project	"Simulate an AI. Exile the created card and put two counters on it. Remove a counter at the start of each of your turns. When the last counter is removed, play it immediately (this does not count as your turn's action)

To complete: Play 3 simulated cards."
Create a Meditation Habit	Thing - Project	"Simulate a distraction and attach it to a project. Any distraction attached to this project is immediately resolved

To complete: You can't."
Set a S.M.A.R.T Goal	Action	Discard a project. Draw 2 cards. Take another action.
A Shroomy Night	Action	For each distraction on your projects, discard it, Simulate a distraction, and attach it to that project. Take another action.
Abraham, Autonomous Artist	Thing - AI	Each turn, put a counter on this. At the start of each player's turn, instead of drawing a card, that player simulates a card for each counter on Abraham. Each player may only play simulated cards, and their number of actions per turn is equal to the number of counters on Abraham.
Prompt Battle	Action	Each player simulates. The player with the highest rarity card immediately plays it. In the event of a tie, you win. If you lose, take another action.
Stuck in the Simulation	Thing	If a player would draw a card, that player simulates instead. When you play a non-simulated card, destroy this. Draw a card, and take another action.
Play a Livecoding Set	Thing - Project	"At the start of the turn after you play this, put a counter on it. Remove a counter from this to gain an extra action this turn.

To complete: Play 4 cards in a turn."
Treasury Collection	Action	Remove all counters from all cards. Each player who removed a counter in this way can discard a distraction from one of their projects.
The Martian Treasury	Thing - Project	"Every 2 turns, put a counter on this. Once per turn, you may move a counter from one of your things to another. 

To complete: Have 4 counters on this."
Trash Fire	Action	Destroy one of your Things at random. Draw 2 cards. If you destroyed a project, take another action.
Chess Club	Thing	At the start of your turn, look at the top card of the draw pile. You may discard it.
The Simulated Times	Thing - Project	"Choose two other Things in play. Simulate distractions based on their names and attach them to this. These distractions cannot be discarded in any way other than resolving them.

To complete: Resolve those distractions."
Watch the Sunset	Action	Draw a card. Choose an opponent. They may choose to draw a card and play it. If they do, draw a card and play it. Take another action.
Meo-Notion	Thing - AI	Simulate a unicycle-related card each turn after your draw step, and put a counter this. When it has 3 counters, discard this and put a Broken Unicycle into play.
Thunder Talk!	Action	Simulate 3 based on a thing you have in play. Play one immediately, discard the rest.
Brainstorming Session	Action	Draw 3 cards, then put two cards from your hand on top of the deck. You may put a Project from your hand into play.
Accountability Group	Thing	Attach this to a project. That project cannot have distractions placed on it for as long as this is attached.
Neurodivergence	Thing	Choose two other things from among your things. Discard them, then simulate a based on a combnation of their names. Play a copy of the new card immediately, and add a copy to your hand.
Smoothie.fyi	Thing - Project	
Super Mars Royale	Thing - Project	"If this has less than 3 counters and you have an action to take, use it and play a card at random from your hand, then put a counter on this. If that card targets, the targets are chosen at random.

To complete: This has 3 counters."
`;
