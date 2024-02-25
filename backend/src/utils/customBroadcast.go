package utils

import (
	"encoding/json"

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/tools/routine"
	"github.com/pocketbase/pocketbase/tools/subscriptions"
)

func BroadcastAny(app *pocketbase.PocketBase, eventName string, data any) error {
	clients := app.SubscriptionsBroker().Clients()
	if len(clients) == 0 {
		return nil // no subscribers
	}

	dataBytes, err := json.Marshal(data)
	if err != nil {
		return err
	}

	encodedData := string(dataBytes)

	msg := subscriptions.Message{
		Name: eventName,
		Data: encodedData,
	}

	for _, client := range clients {

		if !client.HasSubscription(eventName) {
			continue
		}

		routine.FireAndForget(func() {
			if !client.IsDiscarded() {
				client.Channel() <- msg
			}
		})
	}

	return nil
}
