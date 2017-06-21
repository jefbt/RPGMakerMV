//=============================================================================
// Jeferson Tomazella Plugins - Gameus + GALV quest message popup
// JEFGameusGALV_QuestPopup.js
//=============================================================================

var Imported = Imported || {};
Imported.JEFGameusGALV_QuestPopup = true;

var Jef = Jef || {};
Jef = Jef || {};
Jef.Quest = Jef.Quest || {};
Jef.Quest.version = 1.1;


//=============================================================================
 /*:
 * @plugindesc v1.1 Message popup with Gameus Quest System
 * @author Jeferson Tomazella
 *
 * @param X Position
 * @desc X value to show the popups.
 * Default value: 8
 * @default 8
 *
 * @param Y Position
 * @desc Y value to show the popups.
 * Default value: 8
 * @default 8
 *
 * @param Time Show Popup
 * @desc How many frames the popup message will last.
 * Default value: 240
 * @default 240
 *
 * @param Quest Acquired Message
 * @desc Message that will show when the player gets a new quest.
 * Default message: Quest Acquired
 * @default Quest Acquired
 *
 * @param Quest Completed Message
 * @desc Message that will show when the player completes a quest.
 * Default message: Quest Completed
 * @default Quest Completed
 *
 * @param Quest Failed Message
 * @desc Message that will show when the player fails a quest.
 * Default message: Quest Failed
 * @default Quest Failed
 *
 * @param Rewards Text
 * @desc Rewards text in the popup window.
 * Default value: Rewards
 * @default Rewards
 *
 * @param Extra Time for Completed
 * @desc How more frames the popup message will last in completed quests popup.
 * Default value: 120
 * @default 120
 *
 * @param Experience Text
 * @desc The description for the experience text to show in the rewards.
 * Default value: EXP
 * @default EXP
 *
 * @param Gold Text
 * @desc The description for the gold text to show in the rewards.
 * Default value: \G
 * @default \G
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 *
 * Gameus Quest System is far the best quest system I've encoutered out there,
 * but it doesn't have a proper messaging system.
 *
 * This is an alpha plugin to show messages with it's quests.
 *
 * ****IMPORTANT****
 * 
 * This plugins requires the GameusQuestSystem and the GALV_TimedMessagePopups
 * plugins in order to work.
 * This plugin must be placed below that two plugins.
 *
 * I did not make the plugins above, just made then work together.
 * The credits belongs to their respective owners.
 *
 * ============================================================================
 *
 * GameusQuestSystem: 
 * https://forums.rpgmakerweb.com/index.php?threads/gameus-quest-system.49234/
 *
 * You can also find it in the link below, but it may not be updated:
 * https://goo.gl/H1PrfV
 *
 * ============================================================================
 *
 * GALV_TimedMessagePopups is part of his MV Quest Log plugin, it's inside his
 * demo plugin in the link below:
 * https://galvs-scripts.com/2016/11/11/mv-quest-log/
 *
 * A direct dowload link to the demo can be found here: 
 * http://www.mediafire.com/file/oldc3js9xdec8pf/Quest_Log_MV_v.1.2_%28DEMO%29.zip
 *
 * You can also find it in the link below, but it may be not be updated:
 * https://goo.gl/2PeuiW
 *
 * ============================================================================
 *
 * This plugin is just an integration of the two above plugins, commercial and
 * personal use are allowed without the need for credits, just don't distribute
 * this plugin without the proper credits.
 *
 * ============================================================================
 * Changelog
 * ============================================================================
 *
 * Version 1.2:
 * - Show quest steps (TODO)
 *
 * Version 1.1:
 * - Show completed quests rewards.
 *
 * Version 1.0:
 * - Finished Plugin!
 */
//=============================================================================

//=============================================================================
// Parameters
//=============================================================================
Jef.Quest.Parameters = PluginManager.parameters("JEFGameusGALV_QuestPopup");

Jef.Quest.Param = Jef.Quest.Param || {};
Jef.Quest.Param.xPos = Jef.Quest.Parameters["X Position"];
Jef.Quest.Param.yPos = Jef.Quest.Parameters["Y Position"];
Jef.Quest.Param.time = Jef.Quest.Parameters["Time Show Popup"];
Jef.Quest.Param.qAcquiredMessage = Jef.Quest.Parameters["Quest Acquired Message"];
Jef.Quest.Param.qCompletedMessage = Jef.Quest.Parameters["Quest Completed Message"];
Jef.Quest.Param.qFailedMessage = Jef.Quest.Parameters["Quest Failed Message"];
Jef.Quest.Param.rewardsText = Jef.Quest.Parameters["Rewards Text"];
Jef.Quest.Param.extraTime = Jef.Quest.Parameters["Extra Time for Completed"];
Jef.Quest.Param.expText = Jef.Quest.Parameters["Experience Text"];
Jef.Quest.goldText = Jef.Quest.Parameters["Gold Text"];

//=============================================================================
// Functionality
//=============================================================================

	// Gameus changing
	Game_Party.prototype.addQuest = function(quest_id) {
		// Does party already have quest?
        if (this.quests.indexOf(quest_id) < 0) {
            // If not, give that crap to them. They don't have a choice now.
            this.quests.push(quest_id);
			
			// JEF
			Jef.Quest.popupQuest(quest_id,0);
        }
    };
	
	Game_Quest.prototype.fail = function()
	{
        this.status = "failed";
		Jef.Quest.popupQuest(this.questId,2);
    };
	
	Game_Quest.prototype.complete = function()
	{
        if ((GameusScripts["Config"]["QuestSystem"]["Auto Rewards"] || "false").toLowerCase() === "true") {
            this.giveRewards();
        }
        this.currentStep = this.maxSteps - 1;
        this.status = "completed";
		
		Jef.Quest.popupQuest(this.questId,1);
    };

	// I just got Galv popup system and adapted it with gameus quest system.
	Jef.Quest.popupQuest = function(id,status)
	{
		if (!Imported.Galv_MessageCaptions || !SceneManager._scene) return;
		if (!GameusScripts) return;
		
		var x = Number(Jef.Quest.Param.xPos || 8);
		var y = Number(Jef.Quest.Param.yPos || 8);
		
		var time = Number(Jef.Quest.Param.time || 240);
		var extraTimeForCompleted = Number(Jef.Quest.Param.extraTime || 120);
		var rewardsText = Jef.Quest.Param.rewardsText || "Rewards";
		var xpText = Jef.Quest.expText || "EXP";
		var goldText = Jef.Quest.goldText || "\G";
		
		var q = $gameQuests.get(id);
		
		switch (status) {
			case -1:
				return; // -1 is hiding an objective.
			case 0:
				var txt = Jef.Quest.Param.qAcquiredMessage || "Quest Acquired";
				break;
			case 1:
				var txt = Jef.Quest.Param.qCompletedMessage || "Quest Completed";
				time += extraTimeForCompleted;
				
				var extraMessage = [];
				extraMessage[0] = rewardsText + ":";
				
				for (var i = 0; i < q.rewards.length; i += 1)
				{
					var reward = q.rewards[i];
					switch (reward[0]) {
						case "item":
							item = $dataItems[reward[1]];
							amount = reward[2];
							extraMessage[i+1] = String(amount) + " " +item.name;
							break;
						case "armor":
							item = $dataArmors[reward[1]];
							amount = reward[2];
							extraMessage[i+1] = String(amount) + " " +item.name;
							break;
						case "weapon":
							item = $dataWeapons[reward[1]];
							amount = reward[2];
							extraMessage[i+1] = String(amount) + " " +item.name;
							break;
						case "xp":
							amount = reward[1];
							extraMessage[i+1] = String(amount) + " " + xpText;
							break;
						case "gold":
							amount = reward[1];
							extraMessage[i+1] = String(amount) + " " + goldText;
							break;
						case "custom":
							amount = reward[1];
							extraMessage[i+1] = amount.toString();
							break;
					}
				}
				break;
			case 2:
				var txt = Jef.Quest.Param.qFailedMessage || "Quest Failed";
				break;
		}
		if (txt) {
			SceneManager._scene.createCaptionWindow([x,y],time,[txt + ": " + q.name],[],0);
			if (extraMessage != undefined)
			{
				SceneManager._scene.createCaptionWindow([x,y+74],time,extraMessage,[],0);
			}
		}
		
	};


//=============================================================================
// End of File
//=============================================================================
