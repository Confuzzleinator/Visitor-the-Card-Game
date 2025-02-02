/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.visitor.set1;

import com.visitor.card.types.Spell;
import com.visitor.game.Game;
import com.visitor.helpers.Arraylist;
import com.visitor.helpers.Hashmap;
import static com.visitor.protocol.Types.Knowledge.RED;
import java.util.UUID;

/**
 *
 * @author pseudo
 */
public class WalkingFire extends Spell {

    UUID target; 
    
    public WalkingFire(String owner) {
        super("Walking Fire", 2, new Hashmap(RED, 2), 
                "Deal 2 damage \n" +
                "Shuffle ~ to your deck.", owner);
    }
    
    @Override
    protected void duringResolve (Game game){}
    
    @Override
    public void resolve (Game game){
        target = game.selectDamageTargets(controller, 1, false).get(0);
        game.dealDamage(id, target, 2);
        game.shuffleIntoDeck(controller, new Arraylist<>(this));
    }    
}
