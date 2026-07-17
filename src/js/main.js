/**
 * main.js — App entry point
 *
 * Initialises state, binds events, and kicks off the render loop.
 */

import { initState, subscribe } from './state.js';
import { bindAll } from './events.js';
import { render } from './render.js';

// Initialise dates and one blank item
initState();

// Bind all DOM events
bindAll();

// Subscribe: re-render on every state change
subscribe(() => render());

// Initial render
render();
