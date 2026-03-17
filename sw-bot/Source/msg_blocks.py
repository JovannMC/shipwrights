from globals import FEEDBACK_MESSAGE


def feedback_message(ticket_id):
    return [
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "*Hey there, fellow chef!* :wave-pikachu-2:\n"
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": FEEDBACK_MESSAGE
			},
			"accessory": {
				"type": "button",
				"text": {
					"type": "plain_text",
					"text": "Submit Feedback"
				},
				"style": "primary",
				"value": str(ticket_id),
				"action_id": "submit_feedback"
			}
		}
	]

