// Download config

require("suggest-file-name");

// Download in background
download_buffer_automatic_open_target = OPEN_NEW_BUFFER_BACKGROUND;

let (last_save_path = cwd.path) {
    function update_save_path(info) {
        last_save_path = info.target_file.parent.path;
    }
    add_hook("download_added_hook", update_save_path);

    // XXX: There must be a better way than redefining this function
    suggest_save_path_from_file_name = function (file_name, buffer) {
        var cwd = with_current_buffer(buffer, function (I) I.local.cwd);
        var file = cwd.clone();
        var replaced = false;
        for (let re in replace_map) {
            if (file_name.match(re)) {
                if (replace_map[re].path) {
                    file = make_file(replace_map[re].path);
                    replaced = true;
                }
                // file_name = replace_map[re].transformer(file_name);
            }
        }
        if (!replaced) {
            file = make_file(last_save_path);
        }
        file.append(file_name);
        return file.path;
    };
};

// Default location by type
let (d = get_home_directory()) {
    d.append("Downloads");
    // TODO: Windows?
    var replace_map = {
        ".": {
            "path": d.path
            // "transformer": function(x) x
        },
        "\.(html|pdf|ps)$": {
            "path": d.path + "/Documents/"
        },
        "\.(dmg|zip)$": {
            "path": d.path + "/Documents/"
        },
        "\.(mp3)$": {
            "path": d.path + "/Music/"
        },
        "\.(mov|mp4|avi)$": {
            "path": d.path + "/Video/"
        }
    };
};

provide("ublt-download");
