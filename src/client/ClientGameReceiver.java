/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package client;

import card.Card;
import network.Connection;
import network.Message;
import network.Receiver;
import game.ClientGame;
import java.io.Serializable;
import java.util.ArrayList;

/**
 *
 * @author pseudo
 */
public class ClientGameReceiver extends Receiver {
    Client client;
        
    /**
     *
     * @param connection
     * @param client
     */
    public ClientGameReceiver(Connection connection, Client client)
    {
        super(connection);
        this.client = client;
    }
        
    /**
     *
     * @param message
     */
    @Override
    public void handleRequest(Message message){
        System.out.println(message);
        switch(message.label){
            case UPDATE_GAME:
                client.updateGame((ClientGame)message.object);
                break;
            case HAND_SELECTION:
                Serializable[] data = (Serializable[])message.object;
                client.updateGame((ClientGame)data[0]);
                client.handSelection((int)data[1]);
                break;
            case ORDER:
                client.order((ArrayList<Card>)message.object);
                break;
            case LOSE:
                client.lose();
                break;
            case WIN:
                client.win();
                break;
            default:
                System.out.println("Unhandled label: "+ message.toString());
        }
    }
}
