/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.visitor.set1;

import com.visitor.card.types.Ritual;
import com.visitor.game.Game;
import com.visitor.helpers.Hashmap;
import static com.visitor.protocol.Types.Knowledge.GREEN;

/**
 *
 * @author pseudo
 */
public class Channel extends Ritual {
    
    public Channel(String owner) {
        super("Channel", 3, new Hashmap(GREEN, 2), 
        "Gain 4 energy", owner);
    }

    @Override
    protected void duringResolve (Game game){
        game.addEnergy(controller, 4);
    }
}

