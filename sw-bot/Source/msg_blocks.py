from globals import FEEDBACK_MESSAGE, ANNOUNCE_META


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

def meta_message_blocks(text, user_id):
	cleaned_text = text.replace("<@", "").replace(">", "").replace("@", "")
	blocks = [
		{
			"type": "header",
			"text": {
				"type": "plain_text",
				"text": "Meta Post",
				"emoji": True
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": f">*{cleaned_text}*"
			}
		},
		{
			"type": "divider"
		},
	]
	if "<" in text and ANNOUNCE_META:
		blocks.append({
			"type": "context",
			"elements": [
				{
					"type": "mrkdwn",
					"text": f"sent by <@{user_id}> - <!subteam^S09TJU4TT36>"
				}
			]
		})
	elif ANNOUNCE_META:
		blocks.append({
			"type": "context",
			"elements": [
				{
					"type": "mrkdwn",
					"text": "<!subteam^S09TJU4TT36>"
				}
			]
		})
	elif "<" in text:
		blocks.append({
			"type": "context",
			"elements": [
				{
					"type": "mrkdwn",
					"text": f"sent by <@{user_id}>"
				}
			]
		})
	return blocks
