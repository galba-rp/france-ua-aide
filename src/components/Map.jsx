import { React, useState } from "react";
import France from "@svg-maps/france.departments";
import { SVGMap } from "react-svg-map";
import "react-svg-map/lib/index.css";
import { getLocations } from "../services/getLocationsFromStrapi";

export const Map = () => {
  const [list, setList] = useState([]);
  const [message, setMessage] = useState("");
  const [showList, setShowList] = useState(false);
  const [clientX, setClientX] = useState(0);
  const [clientY, setClientY] = useState(0);
  const [showTip, setShowTip] = useState(false);

  const showDepartmentName = (e) => {
    setClientX(e.clientX);
    setClientY(e.clientY);
    setShowTip(true);
  };

  const handleMouseOut = ()=>{
    setClientX(0);
    setClientY(0);
    setShowTip(false);
  }

  const onLocationClick = async (event) => {
    setList([]);
    setMessage("");
    event.preventDefault();
    const id = event.target.getAttribute("id");
    const locs = await getLocations(id);

    if (locs && locs.length > 0) {
      setList(locs);
    }

    //TODO send error notification to discord
    if (locs === "error") {
      setMessage("There was a problem with the server. Try again later");
    }

    if (locs && locs.length === 0) {
      setMessage("there is no places known to us in this departement");
    }
  };


  return (
    <div className="md:grid md:grid-cols-3 mt-12 gap-4">
      <div className="col-span-2 mx-8 relative">
        <SVGMap
          map={France}
          onLocationClick={onLocationClick}
          onLocationMouseOver={(event) =>{ 
            showDepartmentName(event)
          }}
          onLocationMouseOut = {handleMouseOut}
        />
        <div className="w-[40px]" style={{position: 'absolute', left: clientX, top: clientY }}>tooltip</div>
      </div>
      <div className="flex flex-col items-center bg-gradient-to-b from-blue-400/25 to-yellow-400/25">
        <h1>List of centers</h1>
        <div className="">
          <p>{message}</p>
          <ul>
            {list &&
              list.map((i) => (
                <li className="my-4">
                  <div>
                    <h2 className="md:text-xl font-bold">
                      {i.attributes.lieu}
                    </h2>
                    <p>{i.attributes.rue_numero}</p>
                    <p>
                      {i.attributes.code_postale} {i.attributes.nom_ville}
                    </p>
                    <p>{i.attributes.complement_adrr}</p>
                    <p>Tel : {i.attributes.telephone}</p>
                    <p>{i.attributes.email ? i.attributes.email : ""}</p>
                    <a
                      href={i.attributes.url}
                      target="_blank"
                      className="text-blue-600"
                    >
                      {i.attributes.url}
                    </a>

                    <p
                      className={`${
                        i.attributes.info_supp ? "block" : "hidden"
                      } text-slate-600 italic`}
                    >
                      Information supplementaires : {i.attributes.info_supp}
                    </p>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
