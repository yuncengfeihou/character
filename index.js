// 从 SillyTavern 提供的模块中导入 getContext 函数
import { getContext } from "../../../extensions.js";
// 导入 toastr 用于显示提示信息 (可选，但方便反馈)
import { toastr } from "../../../../script.js";


const extensionName = "get-character-info"; // 插件文件夹名称
// const extensionFolderPath = `scripts/extensions/third-party/${extensionName}`; // 这个插件暂时不需要用到文件夹路径
// const extensionSettings = extension_settings[extensionName]; // 这个插件暂时不需要设置
// const defaultSettings = {}; // 这个插件暂时不需要默认设置

/**
 * 获取并显示当前加载的角色的核心描述信息。
 */
function displayCharacterInfo() {
    // 使用 getContext() 获取当前的 Silly Tavern 上下文
    const context = getContext();

    // 上下文中包含了当前加载的角色对象
    // 根据 characters.js 的分析，角色对象通常在 context.character 中
    const currentCharacter = context.character;

    // 检查是否有角色被加载以及角色数据是否完整
    if (!currentCharacter || !currentCharacter.data) {
        toastr.warning("当前没有角色被加载或角色数据不完整。", "获取角色信息失败");
        console.warn("获取角色信息失败：上下文或角色对象不存在", context);
        return;
    }

    // 提取核心描述信息
    // 根据 characters.js 的 charaFormatData 和 readFromV2 函数的逻辑，
    // 核心信息通常位于 character.data 对象中
    const coreInfo = {
        name: currentCharacter.data.name,
        description: currentCharacter.data.description,
        personality: currentCharacter.data.personality,
        scenario: currentCharacter.data.scenario,
        first_mes: currentCharacter.data.first_mes,
        mes_example: currentCharacter.data.mes_example
    };

    console.log("当前加载的角色核心信息:");
    console.log("名称 (name):", coreInfo.name);
    console.log("描述 (description):", coreInfo.description);
    console.log("性格 (personality):", coreInfo.personality);
    console.log("场景 (scenario):", coreInfo.scenario);
    console.log("开场白 (first_mes):", coreInfo.first_mes);
    console.log("对话示例 (mes_example):", coreInfo.mes_example);

    // 可以选择通过 toastr 显示一个简短的提示
    toastr.info(`已获取角色 '${coreInfo.name}' 的信息，详情请查看控制台 (F12)。`, "角色信息");

    // 如果需要，也可以将信息展示在 UI 上，但这需要更复杂的 UI 操作
    // 例如：使用 callGenericPopup 或修改页面上的特定元素
}

// 使用 jQuery 的入口函数，确保在文档加载完成后执行
jQuery(async () => {
    // 创建一个简单的 HTML 结构，包含一个按钮
    const settingsHtml = `<div class="${extensionName}-settings">
        <div class="inline-drawer">
            <div class="inline-drawer-toggle inline-drawer-header">
                <b>获取角色信息插件</b>
                <div class="inline-drawer-icon fa-solid fa-circle-chevron-down down"></div>
            </div>
            <div class="inline-drawer-content">
                <div class="${extensionName}_block flex-container">
                    <input id="get_character_info_button" class="menu_button" type="submit" value="获取当前角色信息" />
                </div>
                <hr class="sysHR" />
            </div>
        </div>
    </div>`;

    // 将 HTML 添加到 Silly Tavern 的扩展设置页面
    $("#extensions_settings").append(settingsHtml);

    // 获取按钮元素并为其绑定点击事件处理函数
    $("#get_character_info_button").on("click", displayCharacterInfo);

    // 这个插件目前没有需要加载的设置，所以不需要调用 loadSettings()
    // 如果未来添加设置，需要实现并调用 loadSettings 函数
});
