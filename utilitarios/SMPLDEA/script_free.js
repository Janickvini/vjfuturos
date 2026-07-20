// smplDEA Web - Multiplicadores (Pesos) & Envelope (Folgas)
// Lógica da Aplicação Unificada

// Dados Padrão (Pré-carregados - Dataset de Países)
const defaultDataset = {"inputs_headers": ["In1", "In2", "In3", "In4", "In5"], "outputs_headers": ["Ou1", "Ou2"], "dmus": [{"name": "United States of America", "inputs": [0.0, 0.324984507821306, 0.0499552534382363, 0.00936485380353241, 0.504596769989765], "outputs": [13.44086021505376, 154.697086356768]}, {"name": "Russia", "inputs": [12.0, 0.34790746462063, 0.120047223186108, 0.0507174834852466, 0.664593170708151], "outputs": [12.69035532994924, 209.145534977347]}, {"name": "China", "inputs": [24.0, 0.2156010258496, 0.0214577117366889, 0.00132935736196289, 0.196894117368071], "outputs": [12.69035532994924, 84.1176457112855]}, {"name": "India", "inputs": [0.0, 0.28427511767302, 0.0263452794202864, 0.00307770981361457, 0.111863208449162], "outputs": [8.445945945945946, 105.092537651594]}, {"name": "South Korea", "inputs": [18.0, 0.278450518760619, 0.140434033791545, 0.213679211661805, 0.544356532150197], "outputs": [6.038647342995169, 194.746878102855]}, {"name": "United Kingdom", "inputs": [0.0, 0.246314856244014, 0.0264362409955336, 0.00430800835688659, 0.304523625690859], "outputs": [5.602240896358544, 102.936380860976]}, {"name": "Japan", "inputs": [0.0, 0.148315458053287, 0.0247346724132941, 0.00163128686809869, 0.193554586599193], "outputs": [5.43773790103317, 66.6405386764496]}, {"name": "France", "inputs": [0.0, 0.230800565944323, 0.0537727001037038, 0.0022405689782718, 0.338259341473737], "outputs": [5.324813631522897, 112.840286777209]}, {"name": "Turkey", "inputs": [0.7, 0.258336130963037, 0.0723567896756189, 0.0164816666502836, 0.494249685323455], "outputs": [5.257623554153523, 158.567525476643]}, {"name": "Italy", "inputs": [0.0, 0.194811691189415, 0.0684279940056647, 0.00113225352629218, 0.244592615991979], "outputs": [4.621072088724584, 98.1516075455596]}, {"name": "Brazil", "inputs": [12.0, 0.179473001728152, 0.0427529255343502, 0.0231188887341376, 0.139373779393982], "outputs": [4.140786749482402, 72.9144787551936]}, {"name": "Pakistan", "inputs": [0.0, 0.33847645200629, 0.0509174688236821, 0.0, 0.272314914729624], "outputs": [3.979307600477517, 137.018257878268]}, {"name": "Indonesia", "inputs": [24.0, 0.129976769679236, 0.0294881710746929, 0.00537595497183075, 0.0998583391648074], "outputs": [3.910833007430583, 65.5258866434754]}, {"name": "Germany", "inputs": [0.0, 0.182190582488563, 0.0263506523450414, 0.00132909132537567, 0.280337933400561], "outputs": [3.844675124951942, 84.6320821716072]}, {"name": "Israel", "inputs": [24.0, 0.38739440562126, 0.228087703500903, 0.181103557650884, 0.772190808629894], "outputs": [3.757985719654265, 266.842805104163]}, {"name": "Iran", "inputs": [18.0, 0.241144670300508, 0.0921612793218596, 0.0152978266542669, 0.3797300705529], "outputs": [3.280839895013123, 138.071278290358]}, {"name": "Spain", "inputs": [0.0, 0.180147511794233, 0.0500367855896872, 0.00115713159131358, 0.304955566109386], "outputs": [3.084515731030228, 94.840784584399]}, {"name": "Australia", "inputs": [0.0, 0.230962724208172, 0.0272355743750544, 0.00430725644160577, 0.375972144265134], "outputs": [3.032140691328078, 111.06782232658]}, {"name": "Egypt", "inputs": [12.0, 0.167457970891417, 0.0972100034167922, 0.0171793707364148, 0.438301829435501], "outputs": [2.918004085205719, 138.36320521553]}, {"name": "Algeria", "inputs": [12.0, 0.42651081765348, 0.0861668575809272, 0.0125625391751129, 0.419948196199939], "outputs": [2.786291446085261, 193.142687682226]}, {"name": "Ukraine", "inputs": [18.0, 0.329115711311265, 0.0839524876911379, 0.0742685704922696, 0.459342813806279], "outputs": [2.663115845539281, 176.387119179701]}, {"name": "Poland", "inputs": [0.0, 0.25000015333465, 0.0596122997025508, 0.0, 0.397594229452926], "outputs": [2.648305084745763, 129.342075008189]}, {"name": "Vietnam", "inputs": [24.0, 0.249125299862395, 0.0639405868611403, 0.184276613162487, 0.352367178053846], "outputs": [2.485089463220676, 153.128368172839]}, {"name": "Saudi Arabia", "inputs": [0.0, 0.486934378884661, 0.0860547339799344, 0.0, 0.530460696160367], "outputs": [2.380385622470841, 221.965148494337]}, {"name": "Thailand", "inputs": [24.0, 0.188528129130796, 0.0776013253255688, 0.0105259446809876, 0.284796586943126], "outputs": [2.204585537918871, 116.389761358428]}, {"name": "Sweden", "inputs": [4.0, 0.161206224103622, 0.0168467104027654, 0.00355151313692182, 0.486817916902407], "outputs": [2.068252326783868, 107.735975942657]}, {"name": "Canada", "inputs": [0.0, 0.184783470982897, 0.0225768426326852, 0.00344148664111654, 0.304424577196676], "outputs": [1.930874686232863, 89.9891368477506]}, {"name": "Singapore", "inputs": [22.0, 0.287393106440845, 0.122166716526412, 0.159848170145838, 0.67997836068576], "outputs": [1.897173211914248, 210.134987162418]}, {"name": "Greece", "inputs": [9.0, 0.280385067564869, 0.162785862025948, 0.0753229605321144, 0.656011521003337], "outputs": [1.873711823121604, 200.940379460269]}, {"name": "Nigeria", "inputs": [0.0, 0.102080416461195, 0.0129259270671122, 0.0, 0.0922111686170324], "outputs": [1.732801940738174, 51.5898022053269]}, {"name": "Mexico", "inputs": [12.0, 0.1171345274946, 0.03036543738193, 0.00232468952049349, 0.120475656819561], "outputs": [1.676445934618608, 53.3696287000139]}, {"name": "Argentina", "inputs": [0.0, 0.114441319132981, 0.0271979333852043, 0.0, 0.230262128080321], "outputs": [1.66306336271412, 64.6920938273628]}, {"name": "Netherlands", "inputs": [0.0, 0.190320259192412, 0.0274545805831467, 0.00126532054274524, 0.300774752783089], "outputs": [1.559575795383656, 90.2076807062392]}, {"name": "Myanmar", "inputs": [24.0, 0.288014121757749, 0.11218995179785, 0.0, 0.202362825726807], "outputs": [1.484780994803267, 141.08941495254]}, {"name": "Norway", "inputs": [12.0, 0.230562170918553, 0.051779659492043, 0.0272532483108195, 0.478345674434799], "outputs": [1.468213184554397, 132.443897577814]}, {"name": "Portugal", "inputs": [0.0, 0.222074531794979, 0.060163241460821, 0.074866573847137, 0.326033911108529], "outputs": [1.458576429404901, 106.246077622135]}, {"name": "South Africa", "inputs": [0.0, 0.155576401211486, 0.0150078457874898, 0.00093340667425806, 0.231930881227668], "outputs": [1.451589490492089, 73.9102004351629]}, {"name": "Philippines", "inputs": [0.0, 0.146500200640936, 0.0169418448149565, 0.00439525491025939, 0.0919834085237691], "outputs": [1.431229426077, 63.9936317533744]}, {"name": "Malaysia", "inputs": [0.0, 0.145938161078023, 0.0499454385325818, 0.00586033669570825, 0.249921933657274], "outputs": [1.346076187912236, 86.6136940519843]}, {"name": "Iraq", "inputs": [0.0, 0.303850844580969, 0.100926185252954, 0.0, 0.355584181112217], "outputs": [1.292323597828896, 159.549397323668]}, {"name": "Switzerland", "inputs": [9.0, 0.128820665356061, 0.0270313589917511, 0.0522122647434974, 0.554537784214282], "outputs": [1.270809505655102, 119.062867932009]}, {"name": "Denmark", "inputs": [4.0, 0.183239386713944, 0.0315302782917903, 0.0277789767201794, 0.41441655388517], "outputs": [1.233197681588359, 108.823721805206]}, {"name": "Colombia", "inputs": [18.0, 0.315054280956083, 0.112504938300189, 0.00252600486167852, 0.0998660987436878], "outputs": [1.19717466778403, 115.393926012279]}, {"name": "Chile", "inputs": [12.0, 0.236266510381388, 0.0759930614407736, 0.00768974740579557, 0.369249283059476], "outputs": [1.196029183112068, 126.358225005708]}, {"name": "Finland", "inputs": [5.0, 0.194483996101619, 0.057157218120287, 0.140969400043055, 0.568637185109664], "outputs": [1.185255422543558, 148.099268265646]}, {"name": "Peru", "inputs": [0.0, 0.179028365013761, 0.0571515976388482, 0.0209164131117586, 0.264656741987579], "outputs": [1.164415463437354, 100.977067403547]}, {"name": "Venezuela", "inputs": [30.0, 0.0345358750408562, 0.143341955021381, 0.00103483020979165, 0.260160790148731], "outputs": [1.125872551227201, 126.396262962968]}, {"name": "Romania", "inputs": [0.0, 0.232286910246233, 0.0776578036357419, 0.0101108204952587, 0.449636102623954], "outputs": [1.113089937666964, 140.268434549814]}, {"name": "Ethiopia", "inputs": [0.0, 0.088510801406398, 0.0143420525215403, 0.0, 0.127960099874355], "outputs": [1.07469102632993, 64.2631638521416]}, {"name": "Hungary", "inputs": [0.0, 0.219882795611753, 0.048701234795506, 0.00753844082845302, 0.323966026538675], "outputs": [0.9747538746466516, 108.68898620994]}, {"name": "Angola", "inputs": [24.0, 0.187216015448411, 0.0424831427867741, 0.0, 0.304297412069653], "outputs": [0.9123255177447313, 130.88219804635]}, {"name": "Kazakhstan", "inputs": [12.0, 0.139080955022443, 0.0448533326520615, 0.0, 0.462185646826446], "outputs": [0.907770515613653, 111.82653593804]}, {"name": "Uzbekistan", "inputs": [12.0, 0.317646476492568, 0.0237245537817076, 0.0, 0.296243079425319], "outputs": [0.899199712256092, 131.126372675596]}, {"name": "Morocco", "inputs": [12.0, 0.348605938995285, 0.0793491444577506, 0.0149199548681356, 0.381428000193118], "outputs": [0.8870753126940477, 171.911900516486]}, {"name": "Azerbaijan", "inputs": [12.0, 0.388552519216182, 0.0966761512273388, 0.107752617620741, 0.520434129392969], "outputs": [0.7980209081477934, 207.001555781887]}, {"name": "Bulgaria", "inputs": [0.0, 0.195639824568804, 0.0635372090454137, 0.00159129382132975, 0.369448615189369], "outputs": [0.7959882193743533, 113.187062602664]}, {"name": "Belgium", "inputs": [0.0, 0.149874577665396, 0.025861745855146, 0.00170449453719604, 0.358802381598646], "outputs": [0.795924864692773, 90.5460410299125]}, {"name": "Serbia", "inputs": [0.0, 0.237157328154364, 0.0550640129693707, 0.0266447101286379, 0.466228186667002], "outputs": [0.7951653944020356, 136.069277354314]}, {"name": "Ecuador", "inputs": [0.0, 0.264312541943215, 0.0282567536891051, 0.024522663420196, 0.18733507535636], "outputs": [0.7679901697258275, 94.511020660777]}, {"name": "Cuba", "inputs": [24.0, 0.283820275504426, 0.0794248455085646, 0.0126451983391958, 0.512890867902145], "outputs": [0.7526719855486979, 152.3871406884]}, {"name": "Austria", "inputs": [6.0, 0.126936166772947, 0.0295265750967302, 0.0514570001222888, 0.347575495002266], "outputs": [0.7297139521307647, 88.8670056776936]}, {"name": "Sri Lanka", "inputs": [0.0, 0.221493866235185, 0.171767830705587, 0.00092298639922733, 0.197708782229192], "outputs": [0.7173086579155011, 129.424064904436]}, {"name": "Belarus", "inputs": [12.0, 0.162694732981813, 0.196377570422872, 0.11182487972033, 0.564933136573476], "outputs": [0.7166403898523721, 170.735383053458]}, {"name": "Slovakia", "inputs": [0.0, 0.22665542524983, 0.0346619698485258, 0.0, 0.393523409640056], "outputs": [0.7154099298898269, 116.613370492096]}, {"name": "Sudan", "inputs": [24.0, 0.158564757949289, 0.0338412961806064, 0.0, 0.298493627801951], "outputs": [0.6776904310111141, 107.3315219471]}, {"name": "Croatia", "inputs": [0.0, 0.21349614677344, 0.0536344339879525, 0.0166400701936783, 0.474861177435126], "outputs": [0.6633939233116625, 131.208886982725]}, {"name": "Jordan", "inputs": [0.0, 0.372251031918869, 0.134571960645139, 0.0233618721930343, 0.576594292246492], "outputs": [0.6196170766466325, 202.226566434436]}, {"name": "Albania", "inputs": [0.0, 0.170644901180271, 0.0336544360494861, 0.0, 0.167922662179669], "outputs": [0.5947071067499257, 75.0436122376661]}, {"name": "Kuwait", "inputs": [12.0, 0.421979140509523, 0.068668120494899, 0.0203595763173314, 0.647998478285366], "outputs": [0.5888587916617596, 218.58032379293]}, {"name": "Bolivia", "inputs": [0.0, 0.176210891776121, 0.0726989818580151, 0.0, 0.217457427675155], "outputs": [0.5806863712908659, 99.2750143285864]}, {"name": "Bahrain", "inputs": [0.0, 0.340244787301008, 0.135947463265464, 0.0, 0.645481943969385], "outputs": [0.5731315910132967, 231.5619728386]}, {"name": "Oman", "inputs": [0.0, 0.499386046084903, 0.109528274095913, 0.0, 0.469419259743621], "outputs": [0.5541087161301047, 221.373233110575]}, {"name": "Kenya", "inputs": [0.0, 0.156808912215032, 0.00646811905462948, 0.0, 0.0946829857741827], "outputs": [0.5514199062586159, 64.6695952632014]}, {"name": "Chad", "inputs": [0.0, 0.294472293690265, 0.0328160657116651, 0.0, 0.189565099300457], "outputs": [0.5344164172723386, 136.180957523076]}, {"name": "New Zealand", "inputs": [0.0, 0.187863990481694, 0.0220569446992768, 0.00205918938828892, 0.210316786314457], "outputs": [0.5252376700456957, 74.0525852951861]}, {"name": "Paraguay", "inputs": [12.0, 0.147361351381811, 0.0480920696328683, 0.0838821310537566, 0.0708766338816251], "outputs": [0.5250997689561017, 69.2864679707553]}, {"name": "Lithuania", "inputs": [9.0, 0.23886904028106, 0.157861936210221, 0.00933364305392999, 0.425733192709959], "outputs": [0.5242463958060288, 151.026977923398]}, {"name": "Mozambique", "inputs": [24.0, 0.231575051934516, 0.00428319371430063, 0.0, 0.16596347127382], "outputs": [0.5190760446405398, 90.134560218221]}, {"name": "Tunisia", "inputs": [12.0, 0.285517752296153, 0.0482544616284211, 0.0, 0.333063878109619], "outputs": [0.5118231139318251, 130.228683349305]}, {"name": "Armenia", "inputs": [24.0, 0.374740484635312, 0.196469486898711, 0.251888459357369, 0.574882685521823], "outputs": [0.4908457271879448, 232.397668884384]}, {"name": "Tanzania", "inputs": [3.0, 0.14793180147532, 0.00568257289883062, 0.00492361419801071, 0.0734977016725623], "outputs": [0.4898119122257054, 68.9399914862819]}, {"name": "Cameroon", "inputs": [0.0, 0.1462938959733, 0.0154822250645002, 0.0, 0.100271370605915], "outputs": [0.4877810838495683, 74.8382572903914]}, {"name": "Georgia", "inputs": [12.0, 0.214411679540343, 0.0833653869764706, 0.0, 0.477112266583736], "outputs": [0.4832085044696786, 137.254406693373]}, {"name": "Cambodia", "inputs": [0.0, 0.259143565894092, 0.136014626605146, 0.0, 0.323368781534512], "outputs": [0.4818812644564379, 164.223431776481]}, {"name": "Slovenia", "inputs": [0.0, 0.151539893542845, 0.039454971446358, 0.00209916168985793, 0.389549152085281], "outputs": [0.4758279406166731, 100.39056581019]}, {"name": "Ireland", "inputs": [0.0, 0.0529349812927609, 0.0209631429549792, 0.00298718858377422, 0.211852259391754], "outputs": [0.4738662749372127, 47.5313367877009]}, {"name": "Mongolia", "inputs": [12.0, 0.119055031131497, 0.0625600439927885, 0.150612261678693, 0.637337076670915], "outputs": [0.4731488052992666, 149.077141426546]}, {"name": "Latvia", "inputs": [0.0, 0.247231821676468, 0.0392521712573748, 0.0212319775131849, 0.267497606067145], "outputs": [0.4706768332862656, 104.677452840339]}, {"name": "Uruguay", "inputs": [0.0, 0.242194166361258, 0.0771857542446295, 0.0, 0.470232208916219], "outputs": [0.4676174888940846, 137.980312667951]}, {"name": "Honduras", "inputs": [0.0, 0.187234852608279, 0.0276691471061414, 0.0222182406028914, 0.0770975642934076], "outputs": [0.4612758891092762, 72.0620730102722]}, {"name": "Ivory Coast", "inputs": [0.0, 0.177037177253374, 0.0124117137958689, 0.0, 0.0414370421229292], "outputs": [0.4587997797761056, 59.9144551815098]}, {"name": "Guatemala", "inputs": [12.0, 0.082581742596332, 0.0304900154343546, 0.0139069843412739, 0.0952377830949168], "outputs": [0.4554563672800145, 44.8672510538348]}, {"name": "Mali", "inputs": [24.0, 0.306922498196647, 0.0122729940214318, 0.0, 0.122714582726394], "outputs": [0.4468474909513384, 115.450392509001]}, {"name": "Kyrgyzstan", "inputs": [18.0, 0.218550978852847, 0.0370076536846107, 0.0, 0.414711351378556], "outputs": [0.4435966818968194, 121.171553116299]}, {"name": "Estonia", "inputs": [8.0, 0.254116442554381, 0.0636755668341454, 0.0481084795202567, 0.501196362839016], "outputs": [0.4363572893485185, 148.878533439058]}, {"name": "Tajikistan", "inputs": [24.0, 0.146319604126811, 0.0204140316990334, 0.0, 0.154650263563343], "outputs": [0.4338583018786065, 60.6530791117158]}, {"name": "Zambia", "inputs": [0.0, 0.160764210519338, 0.0107251455001152, 0.00060028111457519, 0.140062956704155], "outputs": [0.4271496305155696, 70.6412227082403]}, {"name": "Ghana", "inputs": [0.0, 0.0772803943686486, 0.00596202822184467, 0.0, 0.0862615414793712], "outputs": [0.4206098843322818, 39.2016634376766]}, {"name": "Zimbabwe", "inputs": [0.0, 0.00112824605405678, 0.0407916503745762, 0.0, 0.159047206491967], "outputs": [0.419058793948791, 66.6057136870518]}, {"name": "South Sudan", "inputs": [12.0, 0.270303271262908, 0.195968214940917, 0.0, 0.0932152934393068], "outputs": [0.4111673039759878, 161.542921975221]}, {"name": "Uganda", "inputs": [0.0, 0.268168333536932, 0.0121211879308174, 0.00080418266362895, 0.163925597473168], "outputs": [0.4037630718294505, 111.379201951036]}, {"name": "Lebanon", "inputs": [0.0, 0.292108574861741, 0.139309085253623, 0.0, 0.592190833468128], "outputs": [0.3848966552480659, 198.70631117771]}, {"name": "Namibia", "inputs": [0.0, 0.301975379338588, 0.0745769418363206, 0.0, 0.288722445544822], "outputs": [0.3790175864160097, 145.992273618123]}, {"name": "Afghanistan", "inputs": [0.0, 0.179773983460336, 0.0850108525471713, 0.0, 0.239124045940424], "outputs": [0.3781862188941835, 115.648562357382]}, {"name": "Niger", "inputs": [24.0, 0.258459772357595, 0.00528331387694113, 0.0, 0.0625698296162762], "outputs": [0.3746862003072427, 80.5835465435295]}, {"name": "Botswana", "inputs": [0.0, 0.300746741778178, 0.04566650257778, 0.0, 0.437131120689828], "outputs": [0.3635173943073176, 161.952541924163]}, {"name": "Mauritania", "inputs": [24.0, 0.259520001344769, 0.0534891858179552, 0.0, 0.261670236874034], "outputs": [0.3574364656682275, 142.233811999562]}, {"name": "Dominican Republic", "inputs": [0.0, 0.117287740230556, 0.0780464076771991, 0.0, 0.0389441357375921], "outputs": [0.3568497305784534, 58.6781338298768]}, {"name": "Senegal", "inputs": [24.0, 0.185142911865088, 0.0132729506564269, 0.0, 0.136047573884613], "outputs": [0.3556693697538768, 88.2959826729735]}, {"name": "Nepal", "inputs": [0.0, 0.183359007999709, 0.0457030169617806, 0.0, 0.110924028179545], "outputs": [0.3458412588621823, 78.0234748189862]}, {"name": "El Salvador", "inputs": [11.0, 0.182311785586793, 0.0762474062045543, 0.00561075618850486, 0.185699990807791], "outputs": [0.3404718940451466, 88.4985942245146]}, {"name": "Burkina Faso", "inputs": [0.0, 0.275987786953168, 0.00654674182332192, 0.0, 0.0769449430720368], "outputs": [0.3363153292527074, 83.2953255588978]}, {"name": "Madagascar", "inputs": [18.0, 0.115870811613169, 0.00932177310163534, 0.0, 0.035762444837909], "outputs": [0.3267012970041491, 45.7340383635296]}, {"name": "Bosnia and Herzegovina", "inputs": [0.0, 0.128369260658064, 0.0382002812748747, 0.0, 0.338081473169395], "outputs": [0.3246858664242346, 88.7734317546677]}, {"name": "Nicaragua", "inputs": [0.0, 0.106810917260339, 0.0216363794891329, 0.0, 0.373525874525123], "outputs": [0.3229348317509527, 90.542261137656]}, {"name": "Gabon", "inputs": [0.0, 0.208864509819591, 0.0359337801134418, 0.0, 0.327247887796753], "outputs": [0.3144159723313945, 120.328362676699]}, {"name": "Moldova", "inputs": [3.0, 0.0666862016212548, 0.0275692041692307, 0.0805360015388394, 0.420779406059412], "outputs": [0.3071724773460298, 88.7042614789797]}, {"name": "Liberia", "inputs": [0.0, 0.136076925333716, 0.00475019814197533, 0.0, 0.009773293158547], "outputs": [0.2646833064238638, 51.4320860160022]}, {"name": "Sierra Leone", "inputs": [0.0, 0.0913479116415755, 0.0127321548005947, 0.0, 0.0200311807651641], "outputs": [0.2518828241102239, 48.7220702584753]}, {"name": "Central African Republic", "inputs": [24.0, 0.230848303093952, 0.0250978908915498, 0.0, 0.0924421341350614], "outputs": [0.2361442368998984, 94.4020573680616]}, {"name": "Benin", "inputs": [18.0, 0.0807965897157001, 0.0118770105902422, 0.0, 0.0755204943315641], "outputs": [0.2317174900361479, 58.0407325935416]}]};

// Estado Global de la Aplicación
let currentDataset = defaultDataset;
let results = [];

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
    initApp();
    setupEventListeners();
});

function initApp() {
    // Configura o Tema (Escuro por padrão para estética premium)
    const savedTheme = localStorage.getItem("theme") || "dark";
    if (savedTheme === "light") {
        document.body.classList.add("light-theme");
        updateThemeToggleUI("light");
    } else {
        updateThemeToggleUI("dark");
    }

    // Configura quantidade padrão de Inputs/Outputs do dataset
    if (currentDataset.inputs_headers.length > 2) currentDataset.inputs_headers = currentDataset.inputs_headers.slice(0, 2);
    if (currentDataset.outputs_headers.length > 2) currentDataset.outputs_headers = currentDataset.outputs_headers.slice(0, 2);
    if (currentDataset.dmus.length > 15) currentDataset.dmus = currentDataset.dmus.slice(0, 15);
    currentDataset.dmus.forEach(d => {
        if (d.inputs.length > 2) d.inputs = d.inputs.slice(0, 2);
        if (d.outputs.length > 2) d.outputs = d.outputs.slice(0, 2);
    });
    document.getElementById("nInputs").value = currentDataset.inputs_headers.length;
    document.getElementById("nOutputs").value = currentDataset.outputs_headers.length;

    renderDataTable();
}

function setupEventListeners() {
    // Abas de navegação lateral
    const navItems = document.querySelectorAll(".nav-menu .nav-item");
    navItems.forEach(item => {
        item.addEventListener("click", () => {
            const targetId = item.getAttribute("data-target");
            if (!targetId) return;

            navItems.forEach(i => i.classList.remove("active"));
            item.classList.add("active");

            const sections = document.querySelectorAll(".content-section");
            sections.forEach(s => s.classList.remove("active"));
            document.getElementById(targetId).classList.add("active");
        });
    });

    // Alternar Tema Claro / Escuro
    document.getElementById("btn-toggle-theme").addEventListener("click", () => {
        const isLight = document.body.classList.contains("light-theme");
        if (isLight) {
            document.body.classList.remove("light-theme");
            localStorage.setItem("theme", "dark");
            updateThemeToggleUI("dark");
        } else {
            document.body.classList.add("light-theme");
            localStorage.setItem("theme", "light");
            updateThemeToggleUI("light");
        }
    });

    // Zona de Upload de Arquivos Excel
    const dropzone = document.getElementById("upload-dropzone");
    const fileInput = document.getElementById("file-upload-input");

    dropzone.addEventListener("click", () => fileInput.click());

    dropzone.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropzone.classList.add("dragover");
    });

    dropzone.addEventListener("dragleave", () => {
        dropzone.classList.remove("dragover");
    });

    dropzone.addEventListener("drop", (e) => {
        e.preventDefault();
        dropzone.classList.remove("dragover");
        if (e.dataTransfer.files.length > 0) {
            handleFileUpload(e.dataTransfer.files[0]);
        }
    });

    fileInput.addEventListener("change", (e) => {
        if (e.target.files.length > 0) {
            handleFileUpload(e.target.files[0]);
        }
    });

    // Botão de Limpar Planilha Carregada e Voltar para os Dados Padrão
    const btnClear = document.getElementById("btn-clear-file");
    if (btnClear) {
        btnClear.addEventListener("click", () => {
            currentDataset = defaultDataset;
            if (currentDataset.inputs_headers.length > 2) currentDataset.inputs_headers = currentDataset.inputs_headers.slice(0, 2);
    if (currentDataset.outputs_headers.length > 2) currentDataset.outputs_headers = currentDataset.outputs_headers.slice(0, 2);
    if (currentDataset.dmus.length > 15) currentDataset.dmus = currentDataset.dmus.slice(0, 15);
    currentDataset.dmus.forEach(d => {
        if (d.inputs.length > 2) d.inputs = d.inputs.slice(0, 2);
        if (d.outputs.length > 2) d.outputs = d.outputs.slice(0, 2);
    });
    document.getElementById("nInputs").value = currentDataset.inputs_headers.length;
            document.getElementById("nOutputs").value = currentDataset.outputs_headers.length;
            const filePanel = document.getElementById("file-info-panel");
            if (filePanel) filePanel.style.display = "none";
            const dropzone = document.getElementById("upload-dropzone");
            if (dropzone) dropzone.style.display = "flex";
            renderDataTable();
        });
    }

    // Botão de Download de Planilha Modelo
    document.getElementById("btn-download-template").addEventListener("click", () => {
        downloadExcelTemplate();
    });

    // Botão de Calcular Eficiência
    const btnRun = document.getElementById("btn-run-dea");
    if (btnRun) btnRun.addEventListener("click", runDEACalculations);

    const btnCalcData = document.getElementById("btn-calculate-from-data");
    if (btnCalcData) btnCalcData.addEventListener("click", runDEACalculations);

    const btnBackConfig = document.getElementById("btn-back-config");
    if (btnBackConfig) btnBackConfig.addEventListener("click", () => switchSection("section-config"));

    const btnBackDataRes = document.getElementById("btn-back-data-results");
    if (btnBackDataRes) btnBackDataRes.addEventListener("click", () => switchSection("section-data"));

    // Botão de Exportar Resultados para Excel
    document.getElementById("btn-export-excel").addEventListener("click", () => {
        exportResultsToExcel();
    });
}

function updateThemeToggleUI(theme) {
    const btn = document.getElementById("btn-toggle-theme");
    const icon = btn.querySelector("i");
    const textSpan = document.getElementById("theme-btn-text");

    if (theme === "light") {
        icon.className = "fa-solid fa-moon";
        textSpan.textContent = "Modo Escuro";
    } else {
        icon.className = "fa-solid fa-sun";
        textSpan.textContent = "Modo Claro";
    }
}

function handleFileUpload(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });

            let sheetInputs = null;
            let sheetOutputs = null;

            for (let name of workbook.SheetNames) {
                if (name.toLowerCase() === "inputs") sheetInputs = workbook.Sheets[name];
                if (name.toLowerCase() === "outputs") sheetOutputs = workbook.Sheets[name];
            }

            if (!sheetInputs || !sheetOutputs) {
                alert("Erro: O arquivo Excel deve conter as abas 'Inputs' e 'Outputs'.");
                return;
            }

            const rawInputs = XLSX.utils.sheet_to_json(sheetInputs, { header: 1 });
            const rawOutputs = XLSX.utils.sheet_to_json(sheetOutputs, { header: 1 });

            // Identificar colunas e linhas
            const inputsHeaders = rawInputs[0].slice(1).filter(h => h !== null && h !== "");
            const inputsMap = new Map();
            for (let i = 1; i < rawInputs.length; i++) {
                const row = rawInputs[i];
                if (row && row[0] !== undefined && row[0] !== null && String(row[0]).trim() !== "") {
                    const dmuName = String(row[0]).trim();
                    const vals = row.slice(1, 1 + inputsHeaders.length).map(v => v === null || v === undefined ? 0 : parseFloat(v) || 0);
                    inputsMap.set(dmuName, vals);
                }
            }

            const outputsHeaders = rawOutputs[0].slice(1).filter(h => h !== null && h !== "");
            const commonDMUs = [];
            for (let i = 1; i < rawOutputs.length; i++) {
                const row = rawOutputs[i];
                if (row && row[0] !== undefined && row[0] !== null && String(row[0]).trim() !== "") {
                    const dmuName = String(row[0]).trim();
                    if (inputsMap.has(dmuName)) {
                        const outputsVals = row.slice(1, 1 + outputsHeaders.length).map(v => v === null || v === undefined ? 0 : parseFloat(v) || 0);
                        commonDMUs.push({
                            name: dmuName,
                            inputs: inputsMap.get(dmuName),
                            outputs: outputsVals
                        });
                    }
                }
            }

            if (commonDMUs.length === 0) {
                alert("Erro: Não foi encontrada nenhuma DMU com o mesmo nome em ambas as abas.");
                return;
            }

            // Atualizar dataset
            if (commonDMUs.length > 15) {
                commonDMUs = commonDMUs.slice(0, 15);
            }
            if (inputsHeaders.length > 2) {
                inputsHeaders = inputsHeaders.slice(0, 2);
                commonDMUs.forEach(d => d.inputs = d.inputs.slice(0, 2));
            }
            if (outputsHeaders.length > 2) {
                outputsHeaders = outputsHeaders.slice(0, 2);
                commonDMUs.forEach(d => d.outputs = d.outputs.slice(0, 2));
            }
            currentDataset = {
                inputs_headers: inputsHeaders,
                outputs_headers: outputsHeaders,
                dmus: commonDMUs
            };

            // Atualizar inputs da UI
            document.getElementById("nInputs").value = inputsHeaders.length;
            document.getElementById("nOutputs").value = outputsHeaders.length;

            // Atualizar UI de arquivo carregado
            document.getElementById("file-name-display").textContent = file.name;
            document.getElementById("file-info-panel").style.display = "flex";
            document.getElementById("upload-dropzone").style.display = "none";

            renderDataTable();
            alert("Sucesso! Carregado " + commonDMUs.length + " DMUs.");

        } catch(err) {
            console.error(err);
            alert("Erro ao ler o arquivo Excel: " + err.message);
        }
    };
    reader.readAsArrayBuffer(file);
}

function renderDataTable() {
    const table = document.getElementById("table-dmus");
    const rowCountSpan = document.getElementById("data-row-count");
    const badgeInputs = document.getElementById("badge-inputs-count");
    const badgeOutputs = document.getElementById("badge-outputs-count");

    let headerHTML = "<tr><th>DMU</th>";
    for (let h of currentDataset.inputs_headers) {
        headerHTML += "<th><span class='badge badge-input'>" + h + "</span></th>";
    }
    for (let h of currentDataset.outputs_headers) {
        headerHTML += "<th><span class='badge badge-output'>" + h + "</span></th>";
    }
    headerHTML += "</tr>";
    table.querySelector("thead").innerHTML = headerHTML;

    let rowsHTML = "";
    for (let dmu of currentDataset.dmus) {
        rowsHTML += "<tr><td><b>" + dmu.name + "</b></td>";
        for (let v of dmu.inputs) {
            rowsHTML += "<td>" + v.toLocaleString() + "</td>";
        }
        for (let v of dmu.outputs) {
            rowsHTML += "<td>" + v.toLocaleString() + "</td>";
        }
        rowsHTML += "</tr>";
    }
    table.querySelector("tbody").innerHTML = rowsHTML;

    rowCountSpan.textContent = "Total: " + currentDataset.dmus.length + " DMUs";
    badgeInputs.textContent = currentDataset.inputs_headers.length + " Inputs";
    badgeOutputs.textContent = currentDataset.outputs_headers.length + " Outputs";
}

function runDEACalculations() {
    let formulationSelect = document.getElementById("select-formulation");
    if (formulationSelect && formulationSelect.value === "ENVELOPE") {
        alert("O formulado por Envelope (Folgas) é um recurso exclusivo da versão completa do smplDEA Web. A análise será executada por Multiplicadores (Pesos).");
        formulationSelect.value = "MULTIPLIERS";
    }
    if (typeof solver === 'undefined') {
        alert("Erro: A biblioteca de resolução matemática (solver.js) não pôde ser carregada.");
        return;
    }

    const formulation = document.getElementById("select-formulation").value; // MULTIPLIERS ou ENVELOPE
    const modelType = document.getElementById("select-model").value; // CCR ou BCC
    const orientation = document.getElementById("select-orientation").value; // INPUT ou OUTPUT

    const nDmus = currentDataset.dmus.length;
    const nInputs = currentDataset.inputs_headers.length;
    const nOutputs = currentDataset.outputs_headers.length;

    const inputsData = currentDataset.dmus.map(d => d.inputs);
    const outputsData = currentDataset.dmus.map(d => d.outputs);

    results = [];

    // loop por DMU
    for (let o = 0; o < nDmus; o++) {
        const targetDmuName = currentDataset.dmus[o].name;
        let solverResult = null;

        if (formulation === "ENVELOPE") {
            // ==========================================
            // FORMA DE ENVELOPE (Calcula folgas de insumos/produtos)
            // ==========================================
            if (orientation === "INPUT") {
                // --- INPUT ORIENTED ENVELOPMENT ---
                // Minimizar theta - 1e-6 * (sum(slack_in) + sum(slack_out))
                const lpModel = {
                    optimize: "obj",
                    opType: "min",
                    constraints: {},
                    variables: {}
                };

                // Constraints de entrada
                for (let i = 0; i < nInputs; i++) {
                    lpModel.constraints[`in_${i}`] = { equal: 0 };
                }
                // Constraints de saída
                for (let r = 0; r < nOutputs; r++) {
                    lpModel.constraints[`out_${r}`] = { equal: outputsData[o][r] };
                }
                // Convexidade (VRS)
                if (modelType === "BCC") {
                    lpModel.constraints["vrs"] = { equal: 1 };
                }

                // Lambda variables
                for (let j = 0; j < nDmus; j++) {
                    const varName = `lambda_${j}`;
                    lpModel.variables[varName] = {};
                    for (let i = 0; i < nInputs; i++) {
                        lpModel.variables[varName][`in_${i}`] = inputsData[j][i];
                    }
                    for (let r = 0; r < nOutputs; r++) {
                        lpModel.variables[varName][`out_${r}`] = outputsData[j][r];
                    }
                    if (modelType === "BCC") {
                        lpModel.variables[varName]["vrs"] = 1;
                    }
                }

                // Slacks de Insumo
                for (let i = 0; i < nInputs; i++) {
                    const varName = `slack_in_${i}`;
                    lpModel.variables[varName] = {
                        obj: -1e-6,
                        [`in_${i}`]: 1
                    };
                }

                // Slacks de Produto
                for (let r = 0; r < nOutputs; r++) {
                    const varName = `slack_out_${r}`;
                    lpModel.variables[varName] = {
                        obj: -1e-6,
                        [`out_${r}`]: -1
                    };
                }

                // Theta (eficiência de entrada)
                lpModel.variables["theta"] = { obj: 1 };
                for (let i = 0; i < nInputs; i++) {
                    lpModel.variables["theta"][`in_${i}`] = -inputsData[o][i];
                }

                solverResult = solver.Solve(lpModel);
                const score = solverResult.feasible ? (solverResult.theta !== undefined ? solverResult.theta : 0) : 0;
                const slacksIn = Array.from({ length: nInputs }, (_, i) => solverResult[`slack_in_${i}`] || 0);
                const slacksOut = Array.from({ length: nOutputs }, (_, r) => solverResult[`slack_out_${r}`] || 0);

                results.push({ dmuName: targetDmuName, score, slacksIn, slacksOut });

            } else {
                // --- OUTPUT ORIENTED ENVELOPMENT ---
                // Maximizar phi + 1e-6 * (sum(slack_in) + sum(slack_out))
                const lpModel = {
                    optimize: "obj",
                    opType: "max",
                    constraints: {},
                    variables: {}
                };

                for (let i = 0; i < nInputs; i++) {
                    lpModel.constraints[`in_${i}`] = { equal: inputsData[o][i] };
                }
                for (let r = 0; r < nOutputs; r++) {
                    lpModel.constraints[`out_${r}`] = { equal: 0 };
                }
                if (modelType === "BCC") {
                    lpModel.constraints["vrs"] = { equal: 1 };
                }

                // Lambdas
                for (let j = 0; j < nDmus; j++) {
                    const varName = `lambda_${j}`;
                    lpModel.variables[varName] = {};
                    for (let i = 0; i < nInputs; i++) {
                        lpModel.variables[varName][`in_${i}`] = inputsData[j][i];
                    }
                    for (let r = 0; r < nOutputs; r++) {
                        lpModel.variables[varName][`out_${r}`] = outputsData[j][r];
                    }
                    if (modelType === "BCC") {
                        lpModel.variables[varName]["vrs"] = 1;
                    }
                }

                // Slacks In
                for (let i = 0; i < nInputs; i++) {
                    const varName = `slack_in_${i}`;
                    lpModel.variables[varName] = {
                        obj: 1e-6,
                        [`in_${i}`]: 1
                    };
                }

                // Slacks Out
                for (let r = 0; r < nOutputs; r++) {
                    const varName = `slack_out_${r}`;
                    lpModel.variables[varName] = {
                        obj: 1e-6,
                        [`out_${r}`]: -1
                    };
                }

                // Phi
                lpModel.variables["phi"] = { obj: 1 };
                for (let r = 0; r < nOutputs; r++) {
                    lpModel.variables["phi"][`out_${r}`] = -outputsData[o][r];
                }

                solverResult = solver.Solve(lpModel);
                const phi = solverResult.feasible ? (solverResult.phi !== undefined ? solverResult.phi : 1) : 1;
                const score = phi > 0 ? (1.0 / phi) : 0;
                const slacksIn = Array.from({ length: nInputs }, (_, i) => solverResult[`slack_in_${i}`] || 0);
                const slacksOut = Array.from({ length: nOutputs }, (_, r) => solverResult[`slack_out_${r}`] || 0);

                results.push({ dmuName: targetDmuName, score, slacksIn, slacksOut });
            }

        } else {
            // ==========================================
            // FORMA DE MULTIPLICADORES (Calcula pesos das variáveis)
            // ==========================================
            if (modelType === "CCR") {
                if (orientation === "INPUT") {
                    // --- CCR INPUT-ORIENTED MULTIPLIER ---
                    // Maximize sum(u_r * y_ro)
                    // Subject to: sum(v_i * x_io) = 1, sum(u_r * y_rj) - sum(v_i * x_ij) <= 0
                    const lpModel = {
                        optimize: "score",
                        opType: "max",
                        constraints: { linearization: { equal: 1 } },
                        variables: {}
                    };
                    for (let j = 0; j < nDmus; j++) {
                        lpModel.constraints[`dmu_${j}`] = { max: 0 };
                    }
                    for (let i = 0; i < nInputs; i++) {
                        const varName = `v_${i}`;
                        lpModel.variables[varName] = { linearization: inputsData[o][i] };
                        for (let j = 0; j < nDmus; j++) {
                            lpModel.variables[varName][`dmu_${j}`] = -inputsData[j][i];
                        }
                    }
                    for (let r = 0; r < nOutputs; r++) {
                        const varName = `u_${r}`;
                        lpModel.variables[varName] = { score: outputsData[o][r] };
                        for (let j = 0; j < nDmus; j++) {
                            lpModel.variables[varName][`dmu_${j}`] = outputsData[j][r];
                        }
                    }

                    solverResult = solver.Solve(lpModel);
                    const score = solverResult.feasible ? (solverResult.result || 0) : 0;
                    const weightsV = Array.from({ length: nInputs }, (_, i) => solverResult[`v_${i}`] || 0);
                    const weightsU = Array.from({ length: nOutputs }, (_, r) => solverResult[`u_${r}`] || 0);

                    results.push({ dmuName: targetDmuName, score, weightsV, weightsU, w: null });

                } else {
                    // --- CCR OUTPUT-ORIENTED MULTIPLIER ---
                    // Minimize sum(v_i * x_io)
                    // Subject to: sum(u_r * y_ro) = 1, sum(u_r * y_rj) - sum(v_i * x_ij) <= 0
                    const lpModel = {
                        optimize: "phi",
                        opType: "min",
                        constraints: { linearization: { equal: 1 } },
                        variables: {}
                    };
                    for (let j = 0; j < nDmus; j++) {
                        lpModel.constraints[`dmu_${j}`] = { max: 0 };
                    }
                    for (let i = 0; i < nInputs; i++) {
                        const varName = `v_${i}`;
                        lpModel.variables[varName] = { phi: inputsData[o][i] };
                        for (let j = 0; j < nDmus; j++) {
                            lpModel.variables[varName][`dmu_${j}`] = -inputsData[j][i];
                        }
                    }
                    for (let r = 0; r < nOutputs; r++) {
                        const varName = `u_${r}`;
                        lpModel.variables[varName] = { linearization: outputsData[o][r] };
                        for (let j = 0; j < nDmus; j++) {
                            lpModel.variables[varName][`dmu_${j}`] = outputsData[j][r];
                        }
                    }

                    solverResult = solver.Solve(lpModel);
                    const phi = solverResult.feasible ? (solverResult.result || 1) : 1;
                    const score = phi > 0 ? (1.0 / phi) : 0;
                    const weightsV = Array.from({ length: nInputs }, (_, i) => solverResult[`v_${i}`] || 0);
                    const weightsU = Array.from({ length: nOutputs }, (_, r) => solverResult[`u_${r}`] || 0);

                    results.push({ dmuName: targetDmuName, score, weightsV, weightsU, w: null });
                }
            } else {
                // BCC Model (VRS) - w = w1 - w2 (livre de sinal)
                if (orientation === "INPUT") {
                    // --- BCC INPUT-ORIENTED MULTIPLIER ---
                    const lpModel = {
                        optimize: "score",
                        opType: "max",
                        constraints: { linearization: { equal: 1 } },
                        variables: {
                            w1: { score: 1 },
                            w2: { score: -1 }
                        }
                    };
                    for (let j = 0; j < nDmus; j++) {
                        lpModel.constraints[`dmu_${j}`] = { max: 0 };
                        lpModel.variables["w1"][`dmu_${j}`] = 1;
                        lpModel.variables["w2"][`dmu_${j}`] = -1;
                    }
                    for (let i = 0; i < nInputs; i++) {
                        const varName = `v_${i}`;
                        lpModel.variables[varName] = { linearization: inputsData[o][i] };
                        for (let j = 0; j < nDmus; j++) {
                            lpModel.variables[varName][`dmu_${j}`] = -inputsData[j][i];
                        }
                    }
                    for (let r = 0; r < nOutputs; r++) {
                        const varName = `u_${r}`;
                        lpModel.variables[varName] = { score: outputsData[o][r] };
                        for (let j = 0; j < nDmus; j++) {
                            lpModel.variables[varName][`dmu_${j}`] = outputsData[j][r];
                        }
                    }

                    solverResult = solver.Solve(lpModel);
                    const score = solverResult.feasible ? (solverResult.result || 0) : 0;
                    const weightsV = Array.from({ length: nInputs }, (_, i) => solverResult[`v_${i}`] || 0);
                    const weightsU = Array.from({ length: nOutputs }, (_, r) => solverResult[`u_${r}`] || 0);
                    const w1 = solverResult["w1"] || 0;
                    const w2 = solverResult["w2"] || 0;
                    const w = w1 - w2;

                    results.push({ dmuName: targetDmuName, score, weightsV, weightsU, w });

                } else {
                    // --- BCC OUTPUT-ORIENTED MULTIPLIER ---
                    const lpModel = {
                        optimize: "phi",
                        opType: "min",
                        constraints: { linearization: { equal: 1 } },
                        variables: {
                            w1: { phi: -1 },
                            w2: { phi: 1 }
                        }
                    };
                    for (let j = 0; j < nDmus; j++) {
                        lpModel.constraints[`dmu_${j}`] = { max: 0 };
                        lpModel.variables["w1"][`dmu_${j}`] = 1;
                        lpModel.variables["w2"][`dmu_${j}`] = -1;
                    }
                    for (let i = 0; i < nInputs; i++) {
                        const varName = `v_${i}`;
                        lpModel.variables[varName] = { phi: inputsData[o][i] };
                        for (let j = 0; j < nDmus; j++) {
                            lpModel.variables[varName][`dmu_${j}`] = -inputsData[j][i];
                        }
                    }
                    for (let r = 0; r < nOutputs; r++) {
                        const varName = `u_${r}`;
                        lpModel.variables[varName] = { linearization: outputsData[o][r] };
                        for (let j = 0; j < nDmus; j++) {
                            lpModel.variables[varName][`dmu_${j}`] = outputsData[j][r];
                        }
                    }

                    solverResult = solver.Solve(lpModel);
                    const phi = solverResult.feasible ? (solverResult.result || 1) : 1;
                    const score = phi > 0 ? (1.0 / phi) : 0;
                    const weightsV = Array.from({ length: nInputs }, (_, i) => solverResult[`v_${i}`] || 0);
                    const weightsU = Array.from({ length: nOutputs }, (_, r) => solverResult[`u_${r}`] || 0);
                    const w1 = solverResult["w1"] || 0;
                    const w2 = solverResult["w2"] || 0;
                    const w = w1 - w2;

                    results.push({ dmuName: targetDmuName, score, weightsV, weightsU, w });
                }
            }
        }
    }

    // Renderizar a tela de resultados
    renderResultsPanel(formulation, modelType, orientation);

    // Navegar automaticamente para a aba de resultados
    document.querySelector('.nav-item[data-target="section-results"]').click();
}

let currentSort = {
    columnIndex: null,
    direction: 'asc'
};

function renderResultsPanel(formulation, modelType, orientation) {
    const scores = results.map(r => r.score);
    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    const minScore = Math.min(...scores);
    const efficientCount = scores.filter(s => s >= 0.9999).length;

    // Atualizar informações gerais e estatísticas
    document.getElementById("info-val-model").textContent = modelType;
    document.getElementById("info-val-formulation").textContent = formulation === "ENVELOPE" ? "Envelope (Folgas)" : "Multiplicadores (Pesos)";
    document.getElementById("info-val-orientation").textContent = orientation === "INPUT" ? "Entrada (Input)" : "Saída (Output)";
    document.getElementById("info-val-dmus").textContent = scores.length;
    document.getElementById("info-val-avg-efficiency").textContent = (avgScore * 100).toFixed(2) + "%";
    document.getElementById("info-val-efficient-count").textContent = `${efficientCount} / ${scores.length}`;
    document.getElementById("info-val-min-efficiency").textContent = (minScore * 100).toFixed(2) + "%";

    // Ajustar descrição e títulos
    if (formulation === "ENVELOPE") {
        document.getElementById("results-section-desc").textContent = "Scores de eficiência calculados na forma de envelope e as folgas de insumos/produtos.";
        document.getElementById("table-results-title").innerHTML = `<i class="fa-solid fa-list-check icon-accent"></i> Detalhamento de Eficiências e Folgas`;
    } else {
        document.getElementById("results-section-desc").textContent = "Scores de eficiência calculados e os pesos (multiplicadores) ideais das variáveis.";
        document.getElementById("table-results-title").innerHTML = `<i class="fa-solid fa-list-check icon-accent"></i> Detalhamento de Eficiências e Pesos (Multiplicadores)`;
    }

    // Resetar estado de ordenação ao rodar novos cálculos
    currentSort = { columnIndex: null, direction: 'asc' };

    // Renderizar tabela detalhada
    renderResultsTableHeaders(formulation, modelType);
    renderResultsTableRows(formulation, modelType);
}

function handleHeaderSort(colIdx, formulation, modelType) {
    if (currentSort.columnIndex === colIdx) {
        currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
    } else {
        currentSort.columnIndex = colIdx;
        currentSort.direction = 'asc';
    }
    
    const nInputs = currentDataset.inputs_headers.length;
    const nOutputs = currentDataset.outputs_headers.length;

    results.sort((a, b) => {
        let valA, valB;
        if (colIdx === 0) {
            valA = a.dmuName.toLowerCase();
            valB = b.dmuName.toLowerCase();
        } else if (colIdx === 1) {
            valA = a.score;
            valB = b.score;
        } else {
            const idx = colIdx - 2;
            if (formulation === "ENVELOPE") {
                if (idx < nInputs) {
                    valA = a.slacksIn[idx] || 0;
                    valB = b.slacksIn[idx] || 0;
                } else {
                    valA = a.slacksOut[idx - nInputs] || 0;
                    valB = b.slacksOut[idx - nInputs] || 0;
                }
            } else {
                if (idx < nInputs) {
                    valA = a.weightsV[idx] || 0;
                    valB = b.weightsV[idx] || 0;
                } else if (idx < nInputs + nOutputs) {
                    valA = a.weightsU[idx - nInputs] || 0;
                    valB = b.weightsU[idx - nInputs] || 0;
                } else {
                    valA = a.w || 0;
                    valB = b.w || 0;
                }
            }
        }
        
        if (valA < valB) return currentSort.direction === 'asc' ? -1 : 1;
        if (valA > valB) return currentSort.direction === 'asc' ? 1 : -1;
        return 0;
    });

    renderResultsTableHeaders(formulation, modelType);
    renderResultsTableRows(formulation, modelType);
}

function renderResultsTableHeaders(formulation, modelType) {
    const table = document.getElementById("table-results");
    let headers = [];
    
    headers.push({ label: "DMU", index: 0 });
    headers.push({ label: "Score", index: 1 });
    
    let currentIdx = 2;
    const nInputs = currentDataset.inputs_headers.length;
    const nOutputs = currentDataset.outputs_headers.length;

    if (formulation === "ENVELOPE") {
        for (let h of currentDataset.inputs_headers) {
            headers.push({ label: `Folga ${h}`, index: currentIdx++ });
        }
        for (let h of currentDataset.outputs_headers) {
            headers.push({ label: `Folga ${h}`, index: currentIdx++ });
        }
    } else {
        for (let h of currentDataset.inputs_headers) {
            headers.push({ label: `Peso (v) ${h}`, index: currentIdx++ });
        }
        for (let h of currentDataset.outputs_headers) {
            headers.push({ label: `Peso (u) ${h}`, index: currentIdx++ });
        }
        if (modelType === "BCC") {
            headers.push({ label: "Intercepto (w)", index: currentIdx++ });
        }
    }

    let headerHTML = "<tr>";
    headers.forEach(h => {
        let iconClass = "fa-solid fa-sort";
        let activeClass = "";
        if (currentSort.columnIndex === h.index) {
            iconClass = currentSort.direction === 'asc' ? "fa-solid fa-sort-up" : "fa-solid fa-sort-down";
            activeClass = "color: var(--accent-primary);";
        }
        headerHTML += `<th class="sortable-header" data-idx="${h.index}" style="cursor: pointer; user-select: none;">
            <div class="d-flex align-center justify-between">
                <span>${h.label}</span>
                <i class="${iconClass}" style="margin-left: 8px; font-size: 0.8rem; opacity: 0.8; ${activeClass}"></i>
            </div>
        </th>`;
    });
    headerHTML += "</tr>";
    
    table.querySelector("thead").innerHTML = headerHTML;

    // Adicionar eventos de clique nos novos cabeçalhos
    table.querySelectorAll("thead th.sortable-header").forEach(th => {
        th.addEventListener("click", () => {
            const idx = parseInt(th.getAttribute("data-idx"));
            handleHeaderSort(idx, formulation, modelType);
        });
    });
}

function renderResultsTableRows(formulation, modelType) {
    const table = document.getElementById("table-results");
    const nInputs = currentDataset.inputs_headers.length;
    const nOutputs = currentDataset.outputs_headers.length;
    
    let rowsHTML = "";
    for (let r of results) {
        rowsHTML += `<tr>
            <td><b>${r.dmuName}</b></td>
            <td><b>${r.score.toFixed(4)}</b></td>`;

        if (formulation === "ENVELOPE") {
            for (let val of r.slacksIn) {
                rowsHTML += `<td>${val.toFixed(4)}</td>`;
            }
            for (let val of r.slacksOut) {
                rowsHTML += `<td>${val.toFixed(4)}</td>`;
            }
        } else {
            for (let val of r.weightsV) {
                const formattedVal = val < 0.0001 && val > 0 ? val.toExponential(3) : val.toFixed(4);
                rowsHTML += `<td>${formattedVal}</td>`;
            }
            for (let val of r.weightsU) {
                const formattedVal = val < 0.0001 && val > 0 ? val.toExponential(3) : val.toFixed(4);
                rowsHTML += `<td>${formattedVal}</td>`;
            }
            if (modelType === "BCC") {
                const formattedW = Math.abs(r.w) < 0.0001 && r.w !== 0 ? r.w.toExponential(3) : r.w.toFixed(4);
                rowsHTML += `<td>${formattedW}</td>`;
            }
        }
        rowsHTML += "</tr>";
    }
    table.querySelector("tbody").innerHTML = rowsHTML;
}

function exportResultsToExcel() {
    alert("A exportação de dados para Excel (.xlsx) é um recurso exclusivo da versão completa do smplDEA Web.");
    return;
    if (results.length === 0) {
        alert("Sem resultados para exportar. Por favor, calcule a eficiência primeiro.");
        return;
    }

    const formulation = document.getElementById("select-formulation").value;
    const modelType = document.getElementById("select-model").value;
    const orientation = document.getElementById("select-orientation").value;

    const dataRows = [];
    let headers = ["DMU", "Score Eficiência"];

    if (formulation === "ENVELOPE") {
        for (let h of currentDataset.inputs_headers) headers.push("Folga " + h);
        for (let h of currentDataset.outputs_headers) headers.push("Folga " + h);
        dataRows.push(headers);

        for (let r of results) {
            const row = [r.dmuName, r.score];
            for (let val of r.slacksIn) row.push(val);
            for (let val of r.slacksOut) row.push(val);
            dataRows.push(row);
        }
    } else {
        for (let h of currentDataset.inputs_headers) headers.push("Peso (v) " + h);
        for (let h of currentDataset.outputs_headers) headers.push("Peso (u) " + h);
        if (modelType === "BCC") headers.push("Intercepto (w)");
        dataRows.push(headers);

        for (let r of results) {
            const row = [r.dmuName, r.score];
            for (let val of r.weightsV) row.push(val);
            for (let val of r.weightsU) row.push(val);
            if (modelType === "BCC") row.push(r.w);
            dataRows.push(row);
        }
    }

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(dataRows);

    const wscols = headers.map(h => ({ wch: Math.max(h.length + 4, 15) }));
    ws['!cols'] = wscols;

    const sheetName = formulation === "ENVELOPE" ? "Folgas DEA" : "Pesos DEA";
    XLSX.utils.book_append_sheet(wb, ws, sheetName);

    const filename = `smplDEA_${formulation === "ENVELOPE" ? "Envelope_Folgas" : "Multiplicadores_Pesos"}_${modelType}_${orientation}.xlsx`;
    XLSX.writeFile(wb, filename);
}

function downloadExcelTemplate() {
    const wb = XLSX.utils.book_new();
    
    // Preparar dados da planilha de Inputs
    const inputsData = [];
    inputsData.push(["DMU", ...defaultDataset.inputs_headers]);
    
    // Preparar dados da planilha de Outputs
    const outputsData = [];
    outputsData.push(["DMU", ...defaultDataset.outputs_headers]);
    
    // Adicionar dados de exemplo
    defaultDataset.dmus.forEach(dmu => {
        inputsData.push([dmu.name, ...dmu.inputs]);
        outputsData.push([dmu.name, ...dmu.outputs]);
    });
    
    const wsInputs = XLSX.utils.aoa_to_sheet(inputsData);
    const wsOutputs = XLSX.utils.aoa_to_sheet(outputsData);
    
    const autoWidth = (data) => {
        const maxLen = {};
        data.forEach(row => {
            row.forEach((cell, idx) => {
                const valStr = String(cell || '');
                maxLen[idx] = Math.max(maxLen[idx] || 10, valStr.length + 3);
            });
        });
        return Object.keys(maxLen).map(k => ({ wch: maxLen[k] }));
    };
    
    wsInputs['!cols'] = autoWidth(inputsData);
    wsOutputs['!cols'] = autoWidth(outputsData);
    
    XLSX.utils.book_append_sheet(wb, wsInputs, "Inputs");
    XLSX.utils.book_append_sheet(wb, wsOutputs, "Outputs");
    
    XLSX.writeFile(wb, "smplDEA_Modelo_Importacao.xlsx");
}
