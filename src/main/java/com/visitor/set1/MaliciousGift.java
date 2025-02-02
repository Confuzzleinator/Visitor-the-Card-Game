/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.visitor.set1;

import com.visitor.card.types.Ability;
import com.visitor.card.types.TriggeringPassive;
import com.visitor.game.Event;
import static com.visitor.game.Event.EventType.TURN_END;
import com.visitor.game.Game;
import static com.visitor.game.Game.Zone.PLAY;
import com.visitor.helpers.Hashmap;
import static com.visitor.protocol.Types.Knowledge.BLACK;
import java.util.UUID;

/**
 *
 * @author pseudo
 */
public class MaliciousGift extends TriggeringPassive {

    public MaliciousGift(String owner) {
        super("Malicious Gift", 1, new Hashmap(BLACK, 1), 
                "Donate\n" +
                "Trigger - End of your turn\n" +
                "    ~ deals 3 damage to you or target damageable you control, then sacrifice ~.", owner);
    }
    

    @Override
    public void checkEvent(Game game, Event event) {
        if (event.type.equals(TURN_END) 
                && ((String)event.data.get(0)).equals(controller)){
            UUID target = game.selectDamageTargetsConditional(controller, 
                    c->{return c.controller.equals(controller);}, 
                    p->{return p.username.equals(controller);}, 1, false).get(0);
            game.addToStack(new Ability(this,
            "~ deals 3 damage to you or target damageable you control, then sacrifice ~.",
            (x) -> {
                game.dealDamage(id, target, 3);
                game.sacrifice(id);
            }, target));
        }
    }
    
    @Override
    protected void afterResolve(Game game) {
        game.addToStack(new Ability(this,
        "Donate",
        a -> {
            game.donate(id, game.getOpponentName(controller), PLAY);
        }
        ));
    }
}
