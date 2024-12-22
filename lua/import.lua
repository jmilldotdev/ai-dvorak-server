function createCard(imagePath)
    local params = {
        image = imagePath,
        width = 1,
        height = 1,
        position = {0, 1, 0},  -- Change this to the desired position
        rotation = {0, 180, 0},  -- Change this to the desired rotation
        scale = {1, 1, 1},  -- Change this to the desired scale
    }
    spawnObjectData(params)
end