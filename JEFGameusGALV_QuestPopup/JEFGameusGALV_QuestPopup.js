//=============================================================================
// Jeferson Tomazella Plugins - Gameus + GALV quest message popup
// JEFGameusGALV_QuestPopup.js
//=============================================================================

var Imported = Imported || {};
Imported.JEFGameusGALV_QuestPopup = true;

var Jef = Jef || {};
Jef = Jef || {};
Jef.Quest = Jef.Quest || {};
Jef.Quest.version = 1.2;


//=============================================================================
 /*:
 * @plugindesc v1.2 Message popup with Gameus Quest System
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
 * @param Quest Advanced Message
 * @desc Message that will show when the player advances a quest step.
 * Default message: Quest Advanced
 * @default Quest Advanced
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
 * @param Auto Complete
 * @desc Set to true for the quests to autocomplete when using NextStep with
 * the quest's final step. Default value: false
 * @default false
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
 * - Show quest steps when getting or advancing a quest.
 * - Added the possibility to auto complete the quests when using NextStep.
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
Jef.Quest.Param.xPos = Number(Jef.Quest.Parameters["X Position"] || 8);
Jef.Quest.Param.yPos = Number(Jef.Quest.Parameters["Y Position"] || 8);
Jef.Quest.Param.time = Number(Jef.Quest.Parameters["Time Show Popup"] || 240);
Jef.Quest.Param.qAcquiredMessage = Jef.Quest.Parameters["Quest Acquired Message"];
Jef.Quest.Param.qCompletedMessage = Jef.Quest.Parameters["Quest Completed Message"];
Jef.Quest.Param.qFailedMessage = Jef.Quest.Parameters["Quest Failed Message"];
Jef.Quest.Param.qAdvancedMessage = Jef.Quest.Parameters["Quest Advanced Message"];
Jef.Quest.Param.rewardsText = Jef.Quest.Parameters["Rewards Text"];
Jef.Quest.Param.extraTime = Number(Jef.Quest.Parameters["Extra Time for Completed"] || 120);
Jef.Quest.Param.expText = Jef.Quest.Parameters["Experience Text"];
Jef.Quest.Param.goldText = Jef.Quest.Parameters["Gold Text"];
Jef.Quest.Param.autocomplete = (Jef.Quest.Parameters["Auto Complete"] || "false").toLowerCase() == "true" || "yes" || "1" || "sim" || "verdadeiro";

//=============================================================================
// Functionality
//=============================================================================

// Gameus changing
Game_Party.prototype.addQuest = function(quest_id)
{
	if (!GameusScripts) return;
	
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
	if (!GameusScripts) return;
	
	this.status = "failed";
	Jef.Quest.popupQuest(this.questId,2);
};

Game_Quest.prototype.complete = function()
{
	if (!GameusScripts) return;
	
	if ((GameusScripts["Config"]["QuestSystem"]["Auto Rewards"] || "false").toLowerCase() === "true") {
		this.giveRewards();
	}
	this.currentStep = this.maxSteps - 1;
	this.status = "completed";
	
	Jef.Quest.popupQuest(this.questId, 1);
};

Game_Quest.prototype.nextStep = function()
{
	if (!GameusScripts) return;
	
	if (!this.completed())
	{
		if (Jef.Quest.Param.autocomplete)
		{
			if (this.currentStep < this.maxSteps - 1)
			{
				this.currentStep = this.currentStep + 1
				Jef.Quest.popupQuest(this.questId,3);
			}
			else
			{
				this.currentStep = this.maxSteps - 1;
				this.complete();
			}
		}
		else
		{
			this.currentStep = this.currentStep + 1 > this.maxSteps - 1 ? this.maxSteps - 1 : this.currentStep + 1;
	
			Jef.Quest.popupQuest(this.questId,3);
		}
	}
};

// I just got Galv popup system and adapted it with gameus quest system.
Jef.Quest.popupQuest = function(id,status,delay)
{
	if (!Imported.Galv_MessageCaptions || !SceneManager._scene || !Imported.Galv_MessageCaptions || !GameusScripts) return;
	
	var x = Number(Jef.Quest.Param.xPos || 8);
	var y = Number(Jef.Quest.Param.yPos || 8);
	
	var time = Number(Jef.Quest.Param.time || 240);
	var extraTimeForCompleted = Number(Jef.Quest.Param.extraTime || 120);
	var rewardsText = Jef.Quest.Param.rewardsText || "Rewards";
	var xpText = Jef.Quest.Param.expText || "EXP";
	var goldText = Jef.Quest.Param.goldText || "\G";
	
	var q = $gameQuests.get(id);
	
	switch (status) {
		case -1:
			return; // -1 is hiding an objective.
		case 0:
			var txt = Jef.Quest.Param.qAcquiredMessage || "Quest Acquired";
			var extraMessage = [];
			extraMessage[0] = "\\c[0]" + q.steps[0][0];
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
		case 3:
			var txt = Jef.Quest.Param.qAdvancedMessage || "Quest Advanced";
			var extraMessage = [];
			var steps = q.steps.slice(0, q.currentStep + 1);
			for (var i = 0; i < steps.length; i += 1)
			{
				if (q.currentStep > i)
					extraMessage[i] = "\\c[7]" + steps[i][0];
				else
					extraMessage[i] = "\\c[0]" + steps[i][0];
			}
			break;
	}
	if (txt)
	{
		var newDelay = Number(delay || 0);
		SceneManager._scene.createCaptionWindow([x,y],time,[txt + ": " + q.name],[],newDelay);
		if (extraMessage != undefined)
		{
			SceneManager._scene.createCaptionWindow([x,y+74],time,extraMessage,[],newDelay);
		}
	}
	
};


//=============================================================================
// End of File
//=============================================================================
