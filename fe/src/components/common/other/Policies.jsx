
const Policies = ({ policies }) => {

  return (
    <div className="policies-container flex flex-col w-full items-center my-10">
      <h2 className="text-2xl font-bold">What we offer</h2>
      <div className="policies flex">
        {policies?.map((policy, index) => (
          <div className="policy-card hover:scale-125 duration-500 flex items-center justify-center w-1/4 p-4 select-none" key={index}>
            <img className="w-16 h-16 bg-[white] rounded-lg" src={policy.image_url} alt={policy.title} />
            <div className="flex flex-col px-2">
              <h3 className="text-lg font-semibold">{policy.title}</h3>
              <h5 className="text-sm ">{policy.content}</h5>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Policies;