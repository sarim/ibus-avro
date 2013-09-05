
module Jekyll
    class Getversion < Liquid::Tag
        def render(context)
          text = `git describe --long HEAD | sed "s/-[0-9a-z]*$//"`
          text
        end
    end
end

Liquid::Template.register_tag('get_version', Jekyll::Getversion)
