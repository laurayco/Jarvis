#Communicating with Jarvis
The key method of communication with Jarvis will be "conversations." A conversation includes context, subject and statements.

Context involves using a graph database. For example, when planning a Christmas party, the context would connect to the calendar API to identify available time slots, and if available available time slots of intended guests. Jarvis could then offer to initiate and monitor a conversation to determine a solid date.

In that instance, the subject would be "Christmas Party." In instances of ambiguity, this subject will be evaluated for relevance before others. This is one of the critical aspects that distinguishes Jarvis from other AI personal assistants.

The last element, statements, are simply individual sentences and questions communicated between Jarvis and the end user. Statements include a flag for critical (indicates a verbal exclamation mark). Statements can be declarative ( gives knowledge to Jarvis ), imperative ( tells Jarvis to do something ), or inquisitive ( asks a question ).

Declarative statements will need to be either confirmed by the user at time of need, or through external sources. In cases where it cannot be confirmed by external sources, when this data is needed / used, it will be confirmed before doing anything permanent / running calculations. Imperative statements can be detected by the presence of an action verb being the verb in a clause where either "You", "Jarvis", or a an implied "You" is the subject. Questions will be detected by query words (how/why/what/etc) and a linking verb (is/are/etc).

> It should be noted that because human language is diverse, each individual language needs to be coded to detect these basic structures of communication.