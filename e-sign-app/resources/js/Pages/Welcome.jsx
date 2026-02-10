import { Link, Head } from '@inertiajs/react';
import { 
    CheckCircle2, 
    FileText, 
    PenLine, 
    ShieldCheck, 
    Zap, 
    Users, 
    ArrowRight,
    LayoutDashboard,
    LogIn,
    UserPlus
} from 'lucide-react';
import { motion } from 'framer-motion';

const LandingHeader = ({ auth }) => {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="bg-primary h-8 w-8 rounded-lg flex items-center justify-center">
                        <PenLine className="text-primary-foreground h-5 w-5" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-foreground">E-Sign</span>
                </div>
                
                <nav className="flex items-center gap-4">
                    {auth.user ? (
                        <Link
                            href={route('dashboard')}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium text-sm"
                        >
                            <LayoutDashboard className="h-4 w-4" />
                            Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link
                                href={route('login')}
                                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
                            >
                                Log in
                            </Link>
                            <Link
                                href={route('register')}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium text-sm"
                            >
                                {auth.user ? 'Dashboard' : 'Get Started'}
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
};

const LandingHero = ({ auth }) => {
    return (
        <section className="pt-32 pb-20 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-6 tracking-wide uppercase">
                            <Zap className="h-3 w-3" />
                            Speed up your workflow
                        </span>
                        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                            Legally binding signatures, <br className="hidden sm:block" />
                            <span className="text-primary">simplified for teams.</span>
                        </h1>
                        <p className="max-w-2xl mx-auto text-lg text-muted-foreground mb-10 leading-relaxed">
                            Upload documents, define signing workflows, and collect signatures in minutes. The secure, traceable, and professional way to manage your business agreements.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                href={auth.user ? route('dashboard') : route('register')}
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all font-semibold text-lg shadow-lg shadow-primary/20 hover:scale-[1.02]"
                            >
                                {auth.user ? 'Go to Dashboard' : 'Start Free Trial'}
                                <ArrowRight className="h-5 w-5" />
                            </Link>
                            <a
                                href="#features"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border-2 border-border hover:bg-accent transition-all font-semibold text-lg"
                            >
                                Learn More
                            </a>
                        </div>
                    </motion.div>
                    
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="mt-16 relative"
                    >
                        <div className="absolute -top-4 -left-4 -right-4 -bottom-4 bg-gradient-to-b from-primary/5 to-transparent rounded-3xl -z-10 blur-2xl" />
                        <div className="bg-card border rounded-2xl shadow-2xl overflow-hidden aspect-[16/9] flex items-center justify-center">
                            {/* Mock interface or visual */}
                            <div className="flex flex-col items-center gap-4 p-8 text-center text-muted-foreground">
                                <FileText className="h-16 w-16 opacity-20" />
                                <p className="text-sm font-medium max-w-xs">Visualizing the intuitive document signing interface...</p>
                                <div className="flex gap-2 w-full max-w-md">
                                    <div className="h-2 flex-grow rounded bg-muted/50" />
                                    <div className="h-2 flex-grow rounded bg-muted/50" />
                                    <div className="h-2 w-12 rounded bg-primary/30" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

const LandingFeatures = () => {
    const features = [
        {
            icon: ShieldCheck,
            title: "Secure & Valid",
            description: "Legally binding signatures that comply with international standards for digital agreements."
        },
        {
            icon: Zap,
            title: "Lightning Fast",
            description: "Eliminate manual paperwork. Get documents signed and returned in seconds, not days."
        },
        {
            icon: CheckCircle2,
            title: "Audit Traceability",
            description: "Complete immutable log of all document interactions with IP and timestamp tracking."
        },
        {
            icon: Users,
            title: "Team Collaboration",
            description: "Managed workflows for teams of 5 to 50 users. Share, track, and collaborate on documents."
        }
    ];

    return (
        <section id="features" className="py-24 bg-muted/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight mb-4">Everything you need to sign</h2>
                    <p className="text-muted-foreground text-lg">Powerful features to streamline your document management.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, idx) => (
                        <motion.div
                            key={idx}
                            whileHover={{ y: -5 }}
                            className="bg-card border p-6 rounded-2xl shadow-sm hover:shadow-md transition-all"
                        >
                            <div className="bg-primary/10 h-12 w-12 rounded-xl flex items-center justify-center mb-6">
                                <feature.icon className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const LandingWorkflows = () => {
    return (
        <section className="py-24 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <div className="flex-1">
                        <span className="text-primary font-bold tracking-wider uppercase text-xs mb-4 block">How it works</span>
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-8">Flexible workflows for any business case</h2>
                        
                        <div className="space-y-6">
                            {[
                                { title: "Direct Signing", desc: "Upload and sign your own documents instantly for personal or internal use." },
                                { title: "Sequential Signing", desc: "Enforce an ordered signature process where signers must sign one after another." },
                                { title: "Parallel Signing", desc: "Send documents to multiple people simultaneously and collect signatures in any order." }
                            ].map((w, idx) => (
                                <div key={idx} className="flex gap-4">
                                    <div className="bg-primary/10 h-6 w-6 rounded-full flex-shrink-0 flex items-center justify-center mt-1">
                                        <CheckCircle2 className="h-3 w-3 text-primary" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold mb-1">{w.title}</h4>
                                        <p className="text-muted-foreground text-sm">{w.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="flex-1 relative">
                        <div className="bg-primary/20 aspect-square rounded-full absolute -top-12 -right-12 blur-3xl opacity-50" />
                        <div className="relative bg-card border rounded-3xl p-8 shadow-xl max-w-md mx-auto">
                            <div className="flex items-center justify-between mb-8 pb-4 border-b">
                                <span className="font-bold">Signing Status</span>
                                <span className="text-xs text-primary font-medium px-2 py-0.5 rounded bg-primary/10">Sequential</span>
                            </div>
                            <div className="space-y-6">
                                {[
                                    { name: "John Doe", status: "Signed", color: "bg-success" },
                                    { name: "Sarah Miller", status: "Waiting", color: "bg-primary" },
                                    { name: "Alex Chen", status: "Upcoming", color: "bg-muted-foreground/30" }
                                ].map((s, idx) => (
                                    <div key={idx} className="flex items-center gap-3">
                                        <div className={`h-8 w-8 rounded-full ${s.color} flex items-center justify-center text-white text-[10px] font-bold`}>
                                            {s.name[0]}
                                        </div>
                                        <div className="flex-grow">
                                            <p className="text-sm font-semibold text-foreground">{s.name}</p>
                                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{s.status}</p>
                                        </div>
                                        {s.status === "Signed" && <CheckCircle2 className="h-4 w-4 text-success" />}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const LandingFooter = () => {
    return (
        <footer className="py-12 border-t mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-2">
                    <div className="bg-primary h-6 w-6 rounded flex items-center justify-center">
                        <PenLine className="text-primary-foreground h-4 w-4" />
                    </div>
                    <span className="font-bold">E-Sign</span>
                </div>
                
                <div className="flex items-center gap-8 text-sm text-muted-foreground">
                    <a href="#" className="hover:text-primary transition-colors">Documentation</a>
                    <a href="#" className="hover:text-primary transition-colors">Pricing</a>
                    <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
                </div>
                
                <p className="text-xs text-muted-foreground">
                    &copy; {new Date().getFullYear()} E-Sign Document Management. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default function Welcome({ auth }) {
    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
            <Head title="E-Sign - Secure Electronic Signatures" />
            
            <LandingHeader auth={auth} />
            
            <main>
                <LandingHero auth={auth} />
                <LandingFeatures />
                <LandingWorkflows />
                
                <section className="py-24 text-center">
                    <div className="max-w-3xl mx-auto px-4">
                        <h2 className="text-3xl sm:text-4xl font-bold mb-6">Ready to transform your document workflow?</h2>
                        <p className="text-muted-foreground mb-10 text-lg leading-relaxed">Join hundreds of teams who trust E-Sign for their secure, digital agreement needs. Get started today and get your first document signed in minutes.</p>
                        <Link
                            href={auth.user ? route('dashboard') : route('register')}
                            className="inline-flex items-center justify-center gap-2 px-10 py-5 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all font-bold text-xl shadow-xl shadow-primary/30 hover:scale-[1.02]"
                        >
                            Build Your Account
                            <ArrowRight className="h-6 w-6" />
                        </Link>
                    </div>
                </section>
            </main>
            
            <LandingFooter />
        </div>
    );
}

