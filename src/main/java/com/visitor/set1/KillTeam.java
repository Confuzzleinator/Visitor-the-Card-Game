/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package com.visitor.set1;

import com.visitor.card.types.Ability;
import com.visitor.card.types.Asset;
import com.visitor.game.Game;
import com.visitor.helpers.Hashmap;
import static com.visitor.protocol.Types.Counter.CHARGE;
import static com.visitor.protocol.Types.Knowledge.RED;
import java.util.UUID;

/**
 *
 * @author pseudo
 */
public class KillTeam extends Asset {
    
    public KillTeam (String owner){
        super("Kill Team", 2, new Hashmap(RED, 2), 
            "Charge 3. \n" +
            "Discharge 1, Activate: \n" +
            "  Deal 2 damage", owner);
    }
    
    @Override
    public void resolve (Game game) {
        super.resolve(game);
        addCounters(CHARGE, 3);
    }

    @Override
    public boolean canActivate(Game game) {
        return super.canActivate(game) && counters.getOrDefault(CHARGE, 0) > 0;
    }

    @Override
    public void activate(Game game) {
        game.deplete(id);
        removeCounters(CHARGE, 1);
        UUID target = game.selectDamageTargets(controller, 1, false).get(0);
        game.addToStack(new Ability(this,
            "Deal 2 damage",
            (x) -> {
                game.dealDamage(id, target, 2);
            })
        );
    }
}
