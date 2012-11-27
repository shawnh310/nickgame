class GameController < ApplicationController
  layout false

  def main

  end

  def submit_score
    name = params[:name]
    score = params[:score]


    if User.where( { :name=>name } ).empty? == false
      @status = "fail"
      return
    end

    user = User.new

    user.name = name
    user.score = score
    user.save

    @status = "success"
  end

  def get_rank
    name = params[:name]

    p name

    all_records = User.select("name, score").order("score desc")

    p all_records

    my_index = all_records.index { |e| e[:name] == name }

    p my_index


    show_list = []
    show_list.append(my_index - 2) if my_index - 2 >= 0
    show_list.append(my_index - 1) if my_index - 1 >= 0
    show_list.append my_index
    your_index = show_list.size-1
    i = 1
    while show_list.size < 5 and my_index + i < all_records.size
      show_list.append my_index + i
      i+=1
    end

    p show_list

    show_list.map! { |e| [all_records[e],e] }

    p show_list

    output = "{\"your_index\":" + your_index.to_s + ", \"list\":["

    show_list.each do  |e|
      p e
      output += "{\"name\":\"" + e[0][:name] + "\","
      output += "\"score\":" + e[0][:score].to_s + ","
      output += "\"rank\":" + (e[1]+1).to_s + "},"
    end

    output[output.size-1] = ''

    output += "]}"

    p output

    @rank = output

    render :json => output

    p output
  end
end